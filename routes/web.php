<?php

use App\Http\Controllers\JoinRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\ProjectCompletionController;
use App\Http\Controllers\ParticipationConfirmationController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Dedicated Suspended Notice Page (outside not.suspended gate)
Route::middleware(['auth'])->get('/suspended', function (Request $request) {
    if (! $request->user()->isSuspended()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Auth/Suspended', [
        'reason' => $request->user()->suspension_reason,
        'suspended_at' => $request->user()->suspended_at?->toFormattedDateString(),
    ]);
})->name('suspended');


Route::middleware(['auth', 'verified'])->group(function () {

    if (app()->environment(['local', 'testing'])) {
        Route::middleware(['auth'])->get('/design-system', function () {
            return Inertia::render('DesignSystem');
        })->name('design-system');
    }
    
    Route::get('/projects/{project}/complete', [ProjectCompletionController::class, 'create'])->name('projects.complete');
    Route::post('/projects/{project}/complete', [ProjectCompletionController::class, 'store'])->name('projects.complete.store');
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Projects (browsing open to verified students)
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

    //My Projects
    Route::get('/my-projects', [ProjectController::class, 'mine'])->name('projects.mine');
    
    // Gated actions (require completed profile)
    Route::middleware('profile.complete')->group(function () {
        Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::post('/projects/{project}/join', [JoinRequestController::class, 'store'])->name('projects.join');

        // Owner request review and decisions
        Route::get('/projects/{project}/requests', [JoinRequestController::class, 'index'])->name('projects.requests');
        Route::patch('/join-requests/{joinRequest}/accept', [JoinRequestController::class, 'accept'])->name('join-requests.accept');
        Route::patch('/join-requests/{joinRequest}/reject', [JoinRequestController::class, 'reject'])->name('join-requests.reject');
    });

    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::match(['put', 'patch'], '/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');   
    Route::patch('/projects/{project}/status', [ProjectController::class, 'updateStatus'])->name('projects.status');
    Route::patch('/participants/{participant}/confirm', [ParticipationConfirmationController::class, 'update'])
    ->name('participants.confirm');
    
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Join Request Management (Applicant)
    Route::get('/my-applications', [JoinRequestController::class, 'mine'])->name('applications.index');

    // Peer Student Profiles
    Route::get('/students/{user}', [StudentController::class, 'show'])->name('students.show');

    // Profile settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Panel Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/suspend', [AdminUserController::class, 'suspend'])->name('users.suspend');
    Route::post('/users/{user}/unsuspend', [AdminUserController::class, 'unsuspend'])->name('users.unsuspend');
    Route::get('/projects', [AdminProjectController::class, 'index'])->name('projects.index');
    Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy'])->name('projects.destroy');
    Route::post('/projects/{project}/restore', [AdminProjectController::class, 'restore'])->name('projects.restore');
    Route::get('/audit-logs', AuditLogController::class)->name('audit-logs.index');
});


require __DIR__.'/auth.php';