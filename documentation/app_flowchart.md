flowchart TD
A[Visit Root URL] --> B{User Authenticated}
B -->|No| C[Show Sign In and Sign Up Links]
B -->|Yes| D[Redirect to Dashboard]
C --> E[Sign In Page]
C --> F[Sign Up Page]
E --> G[Submit Credentials to Auth Endpoint]
F --> G
G --> H{Auth Success}
H -->|Yes| D
H -->|No| I[Show Error Message]
I --> C
D --> J[Dashboard Page]
J --> K[Click Sign Out]
K --> B