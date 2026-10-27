<?php

return [
    'allowed_email_domains' => array_values(array_filter(array_map(
        'trim',
        explode(',', strtolower(env('ALLOWED_EMAIL_DOMAINS', 'aau.edu.et')))
    ))),
    'feed_page_size' => 12,
];

