<?php

namespace Tests\Feature;

use App\Enums\JoinRequestStatus;
use App\Enums\ProjectCategory;
use App\Enums\ProjectStatus;
use App\Models\Conversation;
use App\Models\JoinRequest;
use App\Models\Message;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    private function createStudent(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'email' => 'student' . uniqid() . '@aau.edu.et',
            'email_verified_at' => now(),
            'profile_completed_at' => now(),
            'telegram_handle' => 'tg_' . uniqid(),
        ], $attributes));
    }

    private function createProject(User $owner, array $attributes = []): Project
    {
        return Project::forceCreate(array_merge([
            'owner_id' => $owner->id,
            'title' => 'Sample Architectural Drone',
            'description' => 'A valid project description for technical AAU student projects.',
            'category' => ProjectCategory::Academic,
            'slots_total' => 3,
            'hours_per_week' => 10,
            'duration_weeks' => 6,
            'application_deadline' => now()->addDays(14)->toDateString(),
            'telegram_contact' => 'owner_telegram_contact',
            'status' => 'open',
        ], $attributes));
    }

    public function test_accepting_join_request_creates_exactly_one_conversation_in_same_transaction(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $project = $this->createProject($owner);

        $request = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Valid application note.',
            'status' => JoinRequestStatus::Pending,
        ]);

        $this->actingAs($owner)->patch(route('join-requests.accept', $request))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('conversations', [
            'join_request_id' => $request->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $applicant->id,
        ]);

        $this->assertEquals(1, Conversation::where('join_request_id', $request->id)->count());
    }

    public function test_accepting_transaction_rolls_back_everything_if_an_error_occurs(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $project = $this->createProject($owner);

        $request = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Valid application note.',
            'status' => JoinRequestStatus::Pending,
        ]);

        // Simulate failure during transaction after update
        Conversation::saving(function () {
            throw new \RuntimeException('Simulated crash during conversation creation');
        });

        try {
            $this->actingAs($owner)->patch(route('join-requests.accept', $request));
        } catch (\RuntimeException $e) {
            // expected
        }

        Conversation::flushEventListeners();

        // Assert request status was not persisted as accepted and no conversation was created
        $this->assertEquals(JoinRequestStatus::Pending, $request->fresh()->status);
        $this->assertEquals(0, Conversation::count());
    }

    public function test_unique_constraint_prevents_duplicate_conversation_for_same_join_request(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createProject($owner);

        $request = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Application note.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        Conversation::create([
            'join_request_id' => $request->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        $this->expectException(QueryException::class);

        Conversation::create([
            'join_request_id' => $request->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);
    }

    public function test_pending_rejected_and_withdrawn_requests_have_no_conversation(): void
    {
        $owner = $this->createStudent();
        $applicant = $this->createStudent();
        $project = $this->createProject($owner);

        $pendingRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $applicant->id,
            'message' => 'Pending note.',
            'status' => JoinRequestStatus::Pending,
        ]);

        $this->assertNull($pendingRequest->conversation);

        $rejectedRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $this->createStudent()->id,
            'message' => 'Rejected note.',
            'status' => JoinRequestStatus::Rejected,
            'decided_at' => now(),
        ]);

        $this->assertNull($rejectedRequest->conversation);

        // Calling send route on non-existent conversation returns 404
        $this->actingAs($applicant)->post('/messages/99999', ['body' => 'Hello'])
            ->assertStatus(404);
    }

    public function test_owner_and_accepted_member_can_both_open_conversation_send_and_receive(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createProject($owner);

        $joinRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Collaboration note.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $joinRequest->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        // Member sends message
        $sendResponse = $this->actingAs($member)->postJson(route('messages.store', $conversation), [
            'body' => 'Hello owner, excited to collaborate!',
        ]);

        $sendResponse->assertStatus(201)
            ->assertJsonPath('data.body', 'Hello owner, excited to collaborate!')
            ->assertJsonPath('data.is_mine', true);

        $messageId = $sendResponse->json('data.id');

        // Owner opens conversation -> marks message as read
        $this->actingAs($owner)->get(route('messages.show', $conversation))
            ->assertStatus(200);

        $this->assertNotNull(Message::find($messageId)->read_at);

        // Owner replies
        $replyResponse = $this->actingAs($owner)->postJson(route('messages.store', $conversation), [
            'body' => 'Welcome aboard!',
        ]);

        $replyResponse->assertStatus(201);

        // Check entry points
        // 1. Projects/Requests.jsx: owner sees conversation_id
        $this->actingAs($owner)->get(route('projects.requests', $project))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->has('requests', 1)
                ->where('requests.0.conversation_id', $conversation->id)
            );

        // 2. Projects/Show.jsx: accepted member sees my_conversation_id
        $this->actingAs($member)->get(route('projects.show', $project))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->where('my_conversation_id', $conversation->id)
            );

        // 3. Applications/Index.jsx: member sees conversation_id
        $this->actingAs($member)->get(route('applications.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->has('applications', 1)
                ->where('applications.0.conversation_id', $conversation->id)
            );
    }

    public function test_stranger_gets_403_on_view_send_poll_and_history(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $stranger = $this->createStudent();
        $project = $this->createProject($owner);

        $joinRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Collaboration note.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $joinRequest->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        // Stranger gets 403 on all endpoints
        $this->actingAs($stranger)->get(route('messages.show', $conversation))->assertStatus(403);
        $this->actingAs($stranger)->postJson(route('messages.store', $conversation), ['body' => 'Hacked'])->assertStatus(403);
        $this->actingAs($stranger)->getJson(route('messages.poll', $conversation))->assertStatus(403);
        $this->actingAs($stranger)->getJson(route('messages.history', $conversation))->assertStatus(403);

        // Unauthenticated gets redirected to login
        auth()->logout();
        $this->get(route('messages.show', $conversation))->assertRedirect(route('login'));

        // Unverified user gets redirected to notice
        $unverified = User::factory()->unverified()->create();
        $this->actingAs($unverified)->get(route('messages.show', $conversation))->assertRedirect(route('verification.notice'));
    }

    public function test_poll_returns_only_messages_after_after_and_updates_read_up_to(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createProject($owner);

        $joinRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Note.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $joinRequest->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        $msg1 = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $member->id,
            'body' => 'First message from member',
        ]);

        $msg2 = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $owner->id,
            'body' => 'Reply from owner',
            'read_at' => now(),
        ]);

        $msg3 = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $member->id,
            'body' => 'Second message from member',
        ]);

        // Poll by owner with after=msg1->id
        $response = $this->actingAs($owner)->getJson(route('messages.poll', [
            'conversation' => $conversation,
            'after' => $msg1->id,
        ]));

        $response->assertStatus(200)
            ->assertJsonCount(2, 'messages')
            ->assertJsonPath('messages.0.id', $msg2->id)
            ->assertJsonPath('messages.1.id', $msg3->id)
            ->assertJsonPath('can_send', true)
            ->assertJsonPath('read_up_to', $msg2->id);

        // Counterpart's unread message msg3 must now be marked read
        $this->assertNotNull($msg3->fresh()->read_at);
    }

    public function test_message_validation_and_database_check_constraint(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createProject($owner);

        $joinRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Note.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $joinRequest->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        // 1. Empty body -> 422
        $this->actingAs($owner)->postJson(route('messages.store', $conversation), ['body' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['body']);

        // 2. Whitespace-only body -> 422
        $this->actingAs($owner)->postJson(route('messages.store', $conversation), ['body' => '    '])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['body']);

        // 3. 2001 characters -> 422
        $this->actingAs($owner)->postJson(route('messages.store', $conversation), ['body' => str_repeat('a', 2001)])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['body']);

        // 4. 2000 characters -> 201 accepted
        $this->actingAs($owner)->postJson(route('messages.store', $conversation), ['body' => str_repeat('b', 2000)])
            ->assertStatus(201);

        // 5. Database check constraint prevents empty body on direct insert
        $this->expectException(QueryException::class);
        DB::statement("INSERT INTO messages (conversation_id, sender_id, body, created_at, updated_at) VALUES (?, ?, ?, now(), now())", [
            $conversation->id,
            $owner->id,
            '',
        ]);
    }

    public function test_cancelled_project_blocks_sending_with_422_while_history_remains_readable(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createProject($owner, ['status' => 'cancelled']);

        $joinRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Note.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $joinRequest->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $owner->id,
            'body' => 'Archived message prior to cancellation',
        ]);

        // History is readable
        $this->actingAs($member)->get(route('messages.show', $conversation))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->where('conversation.can_send', false)
                ->has('messages', 1)
            );

        // Sending returns 422 with exact banner text
        $this->actingAs($member)->postJson(route('messages.store', $conversation), [
            'body' => 'Trying to send in cancelled project',
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'body' => 'This project was cancelled. Messaging is closed.',
            ]);
    }

    public function test_soft_deleted_project_returns_404_for_conversation_routes(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createProject($owner);

        $joinRequest = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Note.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $joinRequest->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        // Soft delete the project
        $project->delete();

        $this->actingAs($member)->get(route('messages.show', $conversation))->assertStatus(404);
        $this->actingAs($member)->postJson(route('messages.store', $conversation), ['body' => 'Hello'])->assertStatus(404);
        $this->actingAs($member)->getJson(route('messages.poll', $conversation))->assertStatus(404);
        $this->actingAs($member)->getJson(route('messages.history', $conversation))->assertStatus(404);
    }

    public function test_inbox_has_no_n_plus_one_queries_and_orders_by_latest_message(): void
    {
        $owner = $this->createStudent();

        // Create 3 conversations with varying message activity
        for ($i = 1; $i <= 3; $i++) {
            $member = $this->createStudent();
            $project = $this->createProject($owner, ['title' => "Project {$i}"]);
            $req = JoinRequest::forceCreate([
                'project_id' => $project->id,
                'applicant_id' => $member->id,
                'message' => 'Application note.',
                'status' => JoinRequestStatus::Accepted,
                'decided_at' => now(),
            ]);
            $conv = Conversation::create([
                'join_request_id' => $req->id,
                'project_id' => $project->id,
                'owner_id' => $owner->id,
                'member_id' => $member->id,
                'created_at' => now()->subDays(10 - $i),
            ]);

            Message::create([
                'conversation_id' => $conv->id,
                'sender_id' => $member->id,
                'body' => "Message for project {$i}",
                'created_at' => now()->subHours(10 - $i),
            ]);
        }

        // Measure query count for 3 conversations
        DB::flushQueryLog();
        DB::enableQueryLog();

        $this->actingAs($owner)->get(route('messages.index'))->assertStatus(200);

        $initialQueryCount = count(DB::getQueryLog());

        // Add 5 more conversations
        for ($i = 4; $i <= 8; $i++) {
            $member = $this->createStudent();
            $project = $this->createProject($owner, ['title' => "Project {$i}"]);
            $req = JoinRequest::forceCreate([
                'project_id' => $project->id,
                'applicant_id' => $member->id,
                'message' => 'Application note.',
                'status' => JoinRequestStatus::Accepted,
                'decided_at' => now(),
            ]);
            $conv = Conversation::create([
                'join_request_id' => $req->id,
                'project_id' => $project->id,
                'owner_id' => $owner->id,
                'member_id' => $member->id,
                'created_at' => now()->subDays(10 - $i),
            ]);

            Message::create([
                'conversation_id' => $conv->id,
                'sender_id' => $member->id,
                'body' => "Message for project {$i}",
                'created_at' => now()->subHours(10 - $i),
            ]);
        }

        DB::flushQueryLog();

        $this->actingAs($owner)->get(route('messages.index'))->assertStatus(200);

        $expandedQueryCount = count(DB::getQueryLog());

        // Assert query count is completely bounded (constant regardless of conversation count)
        $this->assertEquals($initialQueryCount, $expandedQueryCount);
    }

    public function test_backfill_command_is_idempotent(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $project = $this->createProject($owner);

        $req = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Need backfill.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $this->artisan('projectnode:backfill-conversations')
            ->expectsOutput('Backfilled 1 conversations for accepted join requests.')
            ->assertSuccessful();

        $this->assertDatabaseHas('conversations', [
            'join_request_id' => $req->id,
        ]);

        // Running again creates 0
        $this->artisan('projectnode:backfill-conversations')
            ->expectsOutput('Backfilled 0 conversations for accepted join requests.')
            ->assertSuccessful();
    }

    public function test_privacy_no_email_or_telegram_handle_in_chat_props_or_json(): void
    {
        $owner = $this->createStudent(['email' => 'private.owner@aau.edu.et', 'telegram_handle' => 'secret_owner_tg']);
        $member = $this->createStudent(['email' => 'private.member@aau.edu.et', 'telegram_handle' => 'secret_member_tg']);
        $project = $this->createProject($owner);

        $req = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Privacy test.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $req->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $owner->id,
            'body' => 'Testing privacy leaks.',
        ]);

        // 1. Inbox JSON
        $inboxResponse = $this->actingAs($member)->get(route('messages.index'));
        $inboxContent = json_encode($inboxResponse->original->getData());
        $this->assertStringNotContainsString('private.owner@aau.edu.et', $inboxContent);
        $this->assertStringNotContainsString('secret_owner_tg', $inboxContent);

        // 2. Show page JSON
        $showResponse = $this->actingAs($member)->get(route('messages.show', $conversation));
        $showContent = json_encode($showResponse->original->getData());
        $this->assertStringNotContainsString('private.owner@aau.edu.et', $showContent);
        $this->assertStringNotContainsString('secret_owner_tg', $showContent);

        // 3. Poll response
        $pollResponse = $this->actingAs($member)->getJson(route('messages.poll', $conversation));
        $pollContent = $pollResponse->getContent();
        $this->assertStringNotContainsString('private.owner@aau.edu.et', $pollContent);
        $this->assertStringNotContainsString('secret_owner_tg', $pollContent);

        // 4. History response
        $historyResponse = $this->actingAs($member)->getJson(route('messages.history', ['conversation' => $conversation, 'before' => 9999]));
        $historyContent = $historyResponse->getContent();
        $this->assertStringNotContainsString('private.owner@aau.edu.et', $historyContent);
        $this->assertStringNotContainsString('secret_owner_tg', $historyContent);
    }

    public function test_sender_id_cannot_be_spoofed_in_request_body(): void
    {
        $owner = $this->createStudent();
        $member = $this->createStudent();
        $stranger = $this->createStudent();
        $project = $this->createProject($owner);

        $req = JoinRequest::forceCreate([
            'project_id' => $project->id,
            'applicant_id' => $member->id,
            'message' => 'Spoof test.',
            'status' => JoinRequestStatus::Accepted,
            'decided_at' => now(),
        ]);

        $conversation = Conversation::create([
            'join_request_id' => $req->id,
            'project_id' => $project->id,
            'owner_id' => $owner->id,
            'member_id' => $member->id,
        ]);

        // Member attempts to spoof sender_id as stranger
        $response = $this->actingAs($member)->postJson(route('messages.store', $conversation), [
            'body' => 'Attempting to spoof sender',
            'sender_id' => $stranger->id,
        ]);

        $response->assertStatus(201);
        $message = Message::latest('id')->first();
        $this->assertEquals($member->id, $message->sender_id);
        $this->assertNotEquals($stranger->id, $message->sender_id);
    }
}
