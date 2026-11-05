import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatHub from '@/Components/Chat/ChatHub';
import { Head } from '@inertiajs/react';

export default function Show({
    conversations = [],
    conversation = null,
    active_conversation = null,
    messages = [],
    has_earlier_messages = false,
    read_up_to = null,
}) {
    const active = active_conversation || conversation;
    const counterpartName = active?.counterpart?.name || 'Chat';

    return (
        <AuthenticatedLayout>
            <Head title={`Chat with ${counterpartName} - ProjectNode`} />
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
