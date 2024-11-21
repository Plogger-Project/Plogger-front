```
src
├── @types
│   └── react-spring-carousel
│       └── index.d.ts
├── Plogger.css
├── Plogger.tsx
├── apis
│   ├── dto
│   │   ├── request
│   │   │   ├── active
│   │   │   │   ├── index.ts
│   │   │   │   ├── patch-active-comment.request.dto.ts
│   │   │   │   ├── patch-active-post.request.dto.ts
│   │   │   │   ├── post-active-comment.request.dto.ts
│   │   │   │   ├── post-active-post.request.dto.ts
│   │   │   │   ├── post-active-report.request.dto.ts
│   │   │   │   └── post-active-tag.request.dto.ts
│   │   │   ├── alert
│   │   │   │   ├── index.ts
│   │   │   │   └── post-alert.request.dto.ts
│   │   │   ├── auth
│   │   │   │   ├── find-id-request.dto.ts
│   │   │   │   ├── find-password-request.dto.ts
│   │   │   │   ├── id-check.request.dto.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── send-auth-request.dto.ts
│   │   │   │   ├── send-password-auth-request.dto.ts
│   │   │   │   ├── sign-in.request.dto.ts
│   │   │   │   ├── sign-up.request.dto.ts
│   │   │   │   ├── tel-auth-check.request.dto.ts
│   │   │   │   └── tel-auth.request.dto.ts
│   │   │   ├── chat
│   │   │   │   ├── post-chat-message.request.dto.ts
│   │   │   │   └── post-chat-room.request.dto.ts
│   │   │   ├── follow
│   │   │   │   ├── index.ts
│   │   │   │   └── post-follow-request.dto.ts
│   │   │   ├── gifticon
│   │   │   │   ├── index.ts
│   │   │   │   ├── patch-gifticon.request.dto.ts
│   │   │   │   ├── post-gifticon.request.dto.ts
│   │   │   │   └── purchase-gifticon.request.dto.ts
│   │   │   ├── qna
│   │   │   │   ├── index.ts
│   │   │   │   ├── patch-qna-comment.request.dto.ts
│   │   │   │   ├── patch-qna-post.reqeust.dto.ts
│   │   │   │   ├── post-qna-comment.request.dto.ts
│   │   │   │   └── post-qna-post.request.dto.ts
│   │   │   ├── recruit
│   │   │   │   ├── index.ts
│   │   │   │   ├── patch-recruit-comment.request.dto.ts
│   │   │   │   ├── patch-recruit-iscompleted-request.dto.ts
│   │   │   │   ├── patch-recruit-post-request.dto.ts
│   │   │   │   ├── post-recruit-comment.request.dto.ts
│   │   │   │   ├── post-recruit-report-request.dto.ts
│   │   │   │   └── post-recruit.request.dto.ts
│   │   │   └── user
│   │   │       ├── index.ts
│   │   │       ├── patch-comment.request.dto.ts
│   │   │       ├── patch-password.request.dto.ts
│   │   │       ├── patch-tel-auth-check.request.dto.ts
│   │   │       ├── patch-tel-auth.request.dto.ts
│   │   │       └── patch-user.request.dto.ts
│   │   └── response
│   │       ├── active
│   │       │   ├── get-active-comment-list.response.dto.ts
│   │       │   ├── get-active-like.response.dto.ts
│   │       │   ├── get-active-post-list.response.dto.ts
│   │       │   ├── get-active-post.response.dto.ts
│   │       │   ├── get-active-report-list.response.dto.ts
│   │       │   ├── get-my-recruit.response.dto.ts
│   │       │   └── index.ts
│   │       ├── alert
│   │       │   └── get-alert-list.response.dto.ts
│   │       ├── auth
│   │       │   ├── find-id.response.dto.ts
│   │       │   ├── find-password.response.dto.ts
│   │       │   ├── get-sign-in.response.dto.ts
│   │       │   ├── index.ts
│   │       │   └── sign-in.response.dto.ts
│   │       ├── chat
│   │       │   ├── get-message-list.response.dto.ts
│   │       │   ├── get-room-list.response.dto.ts
│   │       │   └── index.ts
│   │       ├── follow
│   │       │   ├── get-follow.response.dto.ts
│   │       │   ├── get-followee-list.response.dto.ts
│   │       │   ├── get-follower-list.response.dto.ts
│   │       │   └── index.ts
│   │       ├── gifticon
│   │       │   ├── get-gifticon-list.response.dto.ts
│   │       │   ├── get-gifticon.response.dto.ts
│   │       │   └── index.ts
│   │       ├── index.ts
│   │       ├── mileage
│   │       │   ├── get-mileage-list.response.dto.ts
│   │       │   └── index.ts
│   │       ├── mypage
│   │       │   ├── get-user-list.response.dto.ts
│   │       │   ├── get-user.response.dto.ts
│   │       │   └── index.ts
│   │       ├── qna
│   │       │   ├── get-qna-comment-list.response.dto.ts
│   │       │   ├── get-qna-list.response.dto.ts
│   │       │   ├── get-qna-post.response.dto.ts
│   │       │   └── index.ts
│   │       ├── recruit
│   │       │   ├── get-recruit-address-count.response.dto.ts
│   │       │   ├── get-recruit-join-list.response.dto.ts
│   │       │   ├── get-recruit-like.response.dto.ts
│   │       │   ├── get-recruit-list.response.dto.ts
│   │       │   ├── get-recruit-report-list.response.dto.ts
│   │       │   ├── get-recruit-scrap-list.response.dto.ts
│   │       │   ├── get-recruit-scrap.response.dto.ts
│   │       │   ├── get-recruit.response.dto.ts
│   │       │   ├── get_recruit-comment-list.response.dto.ts
│   │       │   └── index.ts
│   │       └── response.dto.ts
│   └── index.ts
├── components
│   ├── InputBox
│   │   ├── index.tsx
│   │   └── style.css
│   ├── locationMap
│   │   └── index.tsx
│   └── pagination
│       ├── index.tsx
│       └── style.css
├── constants
│   └── index.ts
├── hooks
│   ├── active.pagination.hook.ts
│   ├── admin.pagination.hook .ts
│   ├── alert.pagination.hook.ts
│   ├── follow.pagination.hook.ts
│   ├── gifticon.pagination.hook.ts
│   ├── index.ts
│   ├── kakao-loader.hook.ts
│   ├── pagination.hook.ts
│   ├── qna.pagination.hook.ts
│   ├── recruit-comment.pagination.hook.ts
│   ├── recruit.pagination.hook.ts
│   └── useGeolocation.hook.ts
├── index.css
├── index.tsx
├── layouts
│   └── MainLayout
│       ├── index.tsx
│       └── style.css
├── react-app-env.d.ts
├── stores
│   ├── index.ts
│   ├── message-list.store.ts
│   ├── room-list.store.ts
│   ├── search.store.ts
│   ├── sign-in-user.store.ts
│   └── socket.store.ts
├── types
│   ├── active-comment.interface.ts
│   ├── active-post.interface.ts
│   ├── activereport.interface.ts
│   ├── alert.interface.ts
│   ├── chat-message.interface.ts
│   ├── chat-room.interface.ts
│   ├── follow.interface.ts
│   ├── gifticon.interface.ts
│   ├── index.ts
│   ├── leave-room.interface.ts
│   ├── mileage.interface.ts
│   ├── my-recruit-post.interface.ts
│   ├── qna-comment.interface.ts
│   ├── qnapost.interface.ts
│   ├── recruit-address-count.interface.ts
│   ├── recruit-comment-list.interface.ts
│   ├── recruit-join.interface.ts
│   ├── recruit-scrap-list.interface.ts
│   ├── recruitpost-markeroverlay.ts
│   ├── recruitpost.interface.ts
│   ├── recruitreport.interface.ts
│   ├── room-invite.interface.ts
│   ├── sign-in-user.interface.ts
│   ├── simple-user.interface.ts
│   └── user.interface.ts
├── utils
│   └── index.ts
└── views
    ├── Active
    │   ├── Detail
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── Update
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── Write
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── index.tsx
    │   └── style.css
    ├── Admin
    │   ├── index.tsx
    │   └── style.css
    ├── Auth
    │   ├── index.tsx
    │   └── style.css
    ├── Chat
    │   ├── Detail
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── index.tsx
    │   └── style.css
    ├── FindId
    │   ├── index.tsx
    │   └── style.css
    ├── FindPassword
    │   ├── index.tsx
    │   └── style.css
    ├── Gifticon
    │   ├── index.tsx
    │   └── style.css
    ├── Main
    │   ├── index.tsx
    │   └── style.css
    ├── MyPage
    │   ├── Update
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── index.tsx
    │   └── style.css
    ├── NavigationBar
    │   ├── index.tsx
    │   └── style.css
    ├── QNA
    │   ├── Detail
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── Update
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── Write
    │   │   ├── index.tsx
    │   │   └── style.css
    │   ├── index.tsx
    │   └── style.css
    └── Recruit
        ├── Detail
        │   ├── index.tsx
        │   └── style.css
        ├── Update
        │   ├── index.tsx
        │   └── style.css
        ├── Write
        │   ├── index.tsx
        │   └── style.css
        ├── index.tsx
        └── style.css

```
