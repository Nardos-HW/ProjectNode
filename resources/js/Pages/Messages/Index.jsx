import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatHub from '@/Components/Chat/ChatHub';
import { Head } from '@inertiajs/react';

export default function Index({
    conversations = [],
    active_conversation = null,
    conversation = null,
    messages = [],
    has_earlier_messages = false,
    read_up_to = null,
}) {
    const active = active_conversation || conversation;

    return (
        <AuthenticatedLayout>
            <Head title="Direct Messages - ProjectNode" />
            <ChatHub
                conversations={conversations}
                activeConversation={active}
                messages={messages}
                hasEarlierMessages={has_earlier_messages}
                readUpTo={read_up_to}
            />
        </AuthenticatedLayout>
    );
}
