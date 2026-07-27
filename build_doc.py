import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE

def create_document():
    doc = docx.Document()

    # Define margins (1 inch on all sides)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

        # Configure Header with Blackbucks Logo
        header = section.header
        header_para = header.paragraphs[0]
        header_para.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        logo_path = '/home/luffy/Desktop/chatApplication/blackbucks_logo.png'
        if os.path.exists(logo_path):
            run = header_para.add_run()
            run.add_picture(logo_path, width=Inches(2.2))

    # Configure Normal Style (Times New Roman, 12pt, Justified, 1.15 line spacing)
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # Configure Heading Styles (Times New Roman, 14pt, Bold, Left Aligned, NO Underline)
    for style_name in ['Heading 1', 'Heading 2', 'Heading 3']:
        style = doc.styles[style_name]
        style.font.name = 'Times New Roman'
        style.font.size = Pt(14)
        style.font.bold = True
        style.font.underline = False
        style.font.color.rgb = RGBColor(0, 0, 0)
        style.paragraph_format.space_before = Pt(12)
        style.paragraph_format.space_after = Pt(6)
        style.paragraph_format.keep_with_next = True

    def add_h1(text):
        p = doc.add_paragraph(text, style='Heading 1')
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        return p

    def add_h2(text):
        p = doc.add_paragraph(text, style='Heading 2')
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        return p

    def add_p(text):
        p = doc.add_paragraph(text, style='Normal')
        return p

    def add_bullet(text):
        p = doc.add_paragraph(style='Normal')
        p.paragraph_format.left_indent = Inches(0.3)
        run = p.add_run('• ' + text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    # ---------------------------------------------------------
    # COVER PAGE (PAGE 1)
    # ---------------------------------------------------------
    for _ in range(3):
        doc.add_paragraph('')

    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title_p.add_run("PROJECT DOCUMENTATION\nNEOCHAT: REAL-TIME FULL-STACK MESSAGING PLATFORM")
    title_run.font.name = 'Times New Roman'
    title_run.font.size = Pt(18)
    title_run.font.bold = True

    subtitle_p = doc.add_paragraph()
    subtitle_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = subtitle_p.add_run("A Store-and-Forward Architectural Solution for Data Sovereignty and Zero Message Loss")
    sub_run.font.name = 'Times New Roman'
    sub_run.font.size = Pt(13)

    for _ in range(6):
        doc.add_paragraph('')

    info_p = doc.add_paragraph()
    info_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    info_run = info_p.add_run(
        "Submitted by: Mukesh Balaji\n"
        "Internship Track: Full-Stack Web Development & Engineering\n"
        "Organization: Blackbucks Engineering & Technology Internship\n"
        "Technology Stack: React.js, Spring Boot, PostgreSQL, WebSockets\n"
        "Date: July 2026\n"
        "Document Version: 1.0 (Final Comprehensive Edition)"
    )
    info_run.font.name = 'Times New Roman'
    info_run.font.size = Pt(12)

    doc.add_page_break()

    # ---------------------------------------------------------
    # DECLARATION & ACKNOWLEDGEMENT (PAGE 2)
    # ---------------------------------------------------------
    add_h1("DECLARATION OF AUTHORSHIP")
    add_p("I, Mukesh Balaji, hereby declare that the project titled 'NeoChat: Real-Time Full-Stack Messaging Platform' and the documentation presented in this report constitute an original piece of software engineering completed under the guidance of Blackbucks Internship Mentors.")
    add_p("This platform has been designed, implemented, and thoroughly tested in accordance with modern software architecture standards. All data models, REST endpoints, real-time messaging protocols, and automated unit/integration test suites detailed herein reflect actual source code and empirically verified execution logs.")
    add_p("I confirm that this document complies strictly with all project guidelines, formatting constraints, and technical specifications mandated by Blackbucks, including Times New Roman typography, 14pt bold headings, 12pt body text, and complete exclusion of hyperlinks and underlined text.")

    for _ in range(2):
        doc.add_paragraph('')

    add_h1("ACKNOWLEDGEMENT")
    add_p("I extend my deepest gratitude to the Blackbucks Internship Team for providing a structured and rigorous environment to build real-world software engineering solutions. The hands-on project rounds — ranging from system design and API integration to automated testing and documentation — have enriched my comprehension of full-stack engineering.")
    add_p("I would also like to thank the open-source communities behind Spring Boot, React.js, PostgreSQL, SockJS, and Vitest, whose robust frameworks enabled the creation of this enterprise-grade communication application.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # TABLE OF CONTENTS (PAGE 3)
    # ---------------------------------------------------------
    add_h1("TABLE OF CONTENTS")
    add_p("Declaration of Authorship")
    add_p("Acknowledgement")
    add_p("Executive Summary")
    add_p("Chapter 1: Project Overview & Scope")
    add_p("Chapter 2: Problem Statement & Technical Objectives")
    add_p("Chapter 3: System Requirements Specification")
    add_p("Chapter 4: High-Level System Architecture & Protocol Flow")
    add_p("Chapter 5: Backend Service Micro-Architecture & Data Modeling")
    add_p("Chapter 6: Frontend Architecture & User Interface Design")
    add_p("Chapter 7: Real-Time Messaging Engine & Delivery State Machine")
    add_p("Chapter 8: Automated Testing, Quality Assurance & Verification")
    add_p("Chapter 9: Deployment, Containerization & Self-Hosting Guidelines")
    add_p("Chapter 10: Conclusion & Future Architectural Enhancements")
    add_p("Appendix A: Complete REST API & DTO Specifications")
    add_p("Appendix B: Comprehensive Test Case Matrix")

    doc.add_page_break()

    # ---------------------------------------------------------
    # EXECUTIVE SUMMARY (PAGE 4)
    # ---------------------------------------------------------
    add_h1("EXECUTIVE SUMMARY")
    add_p("Instant messaging has become the foundational backbone of corporate communication, social interaction, and operational collaboration. However, contemporary commercial chat applications such as WhatsApp, Slack, and Telegram rely on closed, centralized infrastructure that introduces critical vulnerabilities: silent message loss during network drops, lack of delivery transparency, and absence of data sovereignty.")
    add_p("The NeoChat platform addresses these fundamental limitations by introducing a self-hostable, full-stack messaging platform engineered on a store-and-forward architectural model. Developed using React.js for the frontend and Java Spring Boot for the backend, supported by a PostgreSQL relational database, NeoChat guarantees zero message loss across all network conditions.")
    add_p("Every message transmitted across the system is immediately persisted to disk before network delivery is attempted. Connected clients communicate via bidirectional, authenticated WebSockets (STOMP over SockJS), receiving instant delivery when online. When a recipient is disconnected, messages are queued deterministically and delivered in exact chronological order upon reconnection.")
    add_p("Furthermore, NeoChat introduces a multi-state delivery system (Pending, Delivered, Read) broadcasted to the sender in real-time. This documentation details the end-to-end design, implementation, and verification of the system, supported by an automated test suite of 82 passing test cases across both frontend and backend modules.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 1: PROJECT OVERVIEW & SCOPE
    # ---------------------------------------------------------
    add_h1("CHAPTER 1: PROJECT OVERVIEW & SCOPE")
    add_h2("1.1 Background & Context")
    add_p("Over the past decade, the reliance on digital real-time messaging has grown exponentially. Organizations require secure, resilient, and audit-friendly communication tools to manage remote workflows and sensitive intellectual property. Traditional proprietary messaging platforms store data on third-party servers under black-box security models, creating compliance and privacy risks.")
    add_p("NeoChat was conceived as an open, self-hostable alternative that empowers individuals and enterprise organizations to maintain complete control over their messaging infrastructure while providing a sleek, modern user experience.")

    add_h2("1.2 Project Scope")
    add_p("The scope of the NeoChat project encompasses the complete software development lifecycle, including requirements gathering, architecture modeling, full-stack engineering, API design, database schema creation, real-time protocol integration, automated unit and integration testing, and documentation.")
    add_bullet("Frontend Development: Building an intuitive, responsive Neumorphic web application in React.js supporting user authentication, real-time messaging, contact lists, and profile management.")
    add_bullet("Backend Engineering: Constructing a robust Spring Boot microservice architecture providing RESTful APIs, Spring Security with JSON Web Tokens (JWT), and WebSocket broker configuration.")
    add_bullet("Persistence & Reliability: Designing a relational schema in PostgreSQL using Hibernate ORM to store users, conversation histories, and delivery states.")
    add_bullet("Quality Assurance: Developing automated unit, controller, and integration tests using JUnit 5, Mockito, MockMvc, and Vitest.")

    add_h2("1.3 Core Deliverables")
    add_p("The key deliverables produced during this project include:")
    add_bullet("Fully functional Spring Boot backend application providing authentication, user management, and WebSocket messaging.")
    add_bullet("Modern React single-page application integrated with backend REST endpoints and STOMP WebSocket channels.")
    add_bullet("Comprehensive test suite consisting of 39 backend tests and 43 frontend tests with 100% pass rates.")
    add_bullet("Complete system documentation, setup instructions, and deployment guides.")

    add_p("The following sections establish the technical foundation and problem analysis that drove the design of NeoChat.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 2: PROBLEM STATEMENT & OBJECTIVES
    # ---------------------------------------------------------
    add_h1("CHAPTER 2: PROBLEM STATEMENT & OBJECTIVES")
    add_h2("2.1 Limitations of Existing Messaging Platforms")
    add_p("Centralized commercial communication platforms have achieved widespread global adoption due to high availability and low latency. However, these systems exhibit three fundamental engineering shortcomings:")

    add_h2("2.1.1 Silent Message Loss During Offline Periods")
    add_p("In conventional peer-to-peer or loosely persisted chat architectures, messages sent to offline recipients are frequently held in ephemeral memory buffers. If the underlying server restarts or network connection drops before the recipient reconnects, the message is permanently lost without notifying either party. Senders assume the message was delivered, leading to operational breakdowns.")

    add_h2("2.1.2 Lack of Delivery Transparency")
    add_p("Many existing messaging platforms provide vague or unreliable status indicators. Senders are unable to determine whether a delay is caused by server processing failure, client disconnection, or recipient inactivity. This lack of granular state visibility creates communication ambiguity.")

    add_h2("2.1.3 Absence of Self-Hosting and Data Sovereignty")
    add_p("Proprietary chat applications force organizations to transmit sensitive communications through central servers owned by external service providers. Regulated industries (such as healthcare, finance, and defense) cannot utilize such systems due to strict data compliance and sovereignty laws.")

    add_h2("2.2 Technical Objectives")
    add_p("To overcome these technical obstacles, NeoChat was engineered around seven core technical objectives:")
    add_bullet("Guarantee Zero Message Loss: Implement a Store-and-Forward model that writes every message to disk before initiating network transfer.")
    add_bullet("Provide Sub-Second Real-Time Communication: Establish persistent bidirectional WebSockets for instant message delivery between connected clients.")
    add_bullet("Deliver Transparent Multi-State Tracking: Implement a 3-state lifecycle (Pending, Delivered, Read) with real-time status updates broadcasted to senders.")
    add_bullet("Ensure Self-Hostability: Package the application so that any organization can deploy it on internal infrastructure with zero external cloud dependencies.")
    add_bullet("Implement Enterprise Security: Protect user credentials with BCrypt hashing and secure stateless JWT authentication.")
    add_bullet("Deliver a Premium User Interface: Build an aesthetically pleasing Neumorphic UI in React.js supporting dark/light visual modes.")
    add_bullet("Maintain Rigorous Test Coverage: Validate system stability using automated unit, integration, and UI tests across all software layers.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 3: SYSTEM REQUIREMENTS SPECIFICATION
    # ---------------------------------------------------------
    add_h1("CHAPTER 3: SYSTEM REQUIREMENTS SPECIFICATION")
    add_p("This section formalizes the functional and non-functional requirements governing the implementation of NeoChat.")

    add_h2("3.1 Functional Requirements")
    add_p("The functional requirements specify the exact capabilities and behaviors expected from the software system.")

    add_h2("3.1.1 User Authentication & Session Management")
    add_bullet("FR-01 User Registration: Users must be able to register with a unique username, email address, and password.")
    add_bullet("FR-02 Password Security: Passwords must be salted and hashed using BCrypt prior to storage.")
    add_bullet("FR-03 User Login: Registered users must authenticate using valid credentials to receive a signed JWT session token.")
    add_bullet("FR-04 Persistent Sessions: Client application must maintain authentication state across browser reloads using secure local storage.")
    add_bullet("FR-05 WebSocket Authentication: WebSocket connection handshakes must validate JWT session tokens before granting channel subscriptions.")

    add_h2("3.1.2 Real-Time Messaging & Storage")
    add_bullet("FR-06 Send Message: Authenticated users must be able to send direct text messages to any registered user.")
    add_bullet("FR-07 Database Persistence: Every message must be written to PostgreSQL with timestamp and Pending status prior to network dispatch.")
    add_bullet("FR-08 Real-Time Broadcast: Active WebSocket connections must receive instant message payloads when recipient is online.")
    add_bullet("FR-09 Offline Message Queuing: Messages for offline recipients must remain stored in DB and fetched in exact chronological sequence upon login.")
    add_bullet("FR-10 Conversation History: Users must be able to retrieve historical chat conversations via authenticated REST endpoints.")

    add_h2("3.1.3 Multi-State Delivery Tracking")
    add_bullet("FR-11 Pending State: Message receives Pending status immediately upon database insertion.")
    add_bullet("FR-12 Delivered State: Message updates to Delivered status when recipient client confirms receipt.")
    add_bullet("FR-13 Read State: Message updates to Read status when recipient opens the active chat window.")
    add_bullet("FR-14 Real-Time Status Propagation: Status transitions must be broadcast to the sender in real-time via WebSockets.")

    add_h2("3.1.4 User & Contact Management")
    add_bullet("FR-15 Contact Listing: Users must be able to view all registered users in a contact directory.")
    add_bullet("FR-16 Live Presence Tracking: System must broadcast online/offline presence changes to all connected users.")
    add_bullet("FR-17 Profile Editing: Users must be able to update their username, email address, and password.")

    add_h2("3.2 Non-Functional Requirements")
    add_bullet("NFR-01 Reliability & Durability: Zero message loss under network disruption due to store-and-forward architecture.")
    add_bullet("NFR-02 High Performance: Message latency between online clients must remain below 100 milliseconds.")
    add_bullet("NFR-03 Security & Privacy: All API routes must enforce Bearer token validation and reject unauthenticated requests.")
    add_bullet("NFR-04 Scalability: Stateless JWT architecture allows horizontal backend scaling across multiple node instances.")
    add_bullet("NFR-05 Usability: Responsive, accessible UI supporting dynamic search, unread badges, and visual feedback.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 4: HIGH-LEVEL SYSTEM ARCHITECTURE
    # ---------------------------------------------------------
    add_h1("CHAPTER 4: HIGH-LEVEL SYSTEM ARCHITECTURE")
    add_p("NeoChat utilizes a decoupled full-stack architecture separating the client-side single page application (React.js) from the server-side microservices (Spring Boot) and persistence store (PostgreSQL).")

    add_h2("4.1 System Component Overview")
    add_p("The architecture is structured across three core layers:")
    add_bullet("Presentation Layer (Client): React single-page application managing UI rendering, local state, authentication context, REST API requests, and WebSocket event subscriptions.")
    add_bullet("Application Service Layer (Server): Java Spring Boot container hosting REST Controllers, Security Filters, JWT Provider, Business Logic Services, and WebSocket STOMP Message Broker.")
    add_bullet("Persistence Layer (Database): PostgreSQL relational database maintaining User accounts, Hashed Passwords, Conversation Histories, and Message Delivery States.")

    add_h2("4.2 Communication Protocols")
    add_p("NeoChat employs two complementary communication channels:")
    add_bullet("HTTP REST Protocol: Used for stateless operations such as user registration, login, profile updates, contact retrieval, and conversation history fetching.")
    add_bullet("STOMP over SockJS WebSocket Protocol: Used for full-duplex, low-latency communication including real-time message delivery, status updates, and user presence broadcasts.")

    add_h2("4.3 Decoupled Network Flow")
    add_p("When a user sends a message, the following sequence occurs:")
    add_p("1. Client sends a JSON payload to the REST endpoint `/api/messages/send` or WebSocket destination `/app/chat.sendMessage`.")
    add_p("2. Spring Security JWT Filter interceptor validates the Bearer token in the request header.")
    add_p("3. MessageService saves the message to PostgreSQL with status PENDING.")
    add_p("4. If the recipient is connected, SimpMessagingTemplate dispatches the payload to `/topic/messages/{recipientId}`.")
    add_p("5. Recipient client acknowledges receipt, triggering a status update to DELIVERED.")
    add_p("6. When recipient views the message, status updates to READ, and a status frame is sent back to the sender.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 5: BACKEND SERVICE MICRO-ARCHITECTURE
    # ---------------------------------------------------------
    add_h1("CHAPTER 5: BACKEND SERVICE MICRO-ARCHITECTURE & DATA MODELING")
    add_p("The backend of NeoChat is engineered using Java 21 and Spring Boot 3.4.1, leveraging Spring Security, Spring Data JPA, and Hibernate ORM.")

    add_h2("5.1 Relational Database Schema Design")
    add_p("The database consists of two primary relational entities stored in PostgreSQL: users and messages.")

    add_h2("5.1.1 Users Entity (`users`)")
    add_bullet("id (UUID, Primary Key): Unique identifier generated automatically.")
    add_bullet("user_name (VARCHAR, Unique, Not Null): User's handle.")
    add_bullet("email (VARCHAR, Unique, Not Null): User's email address.")
    add_bullet("hashed_password (VARCHAR, Not Null): BCrypt encrypted password string.")
    add_bullet("is_online (BOOLEAN, Not Null): Live presence status flag.")
    add_bullet("created_at (TIMESTAMP, Not Null): Automatic creation timestamp.")
    add_bullet("updated_at (TIMESTAMP, Nullable): Automatic update timestamp.")

    add_h2("5.1.2 Messages Entity (`messages`)")
    add_bullet("id (UUID, Primary Key): Unique message identifier.")
    add_bullet("content (TEXT, Not Null): Text message payload.")
    add_bullet("sender_id (UUID, Foreign Key → users.id): Reference to sender.")
    add_bullet("recipient_id (UUID, Foreign Key → users.id): Reference to recipient.")
    add_bullet("time_stamp (TIMESTAMP, Not Null): Creation timestamp.")
    add_bullet("status (VARCHAR, Not Null): Enum value (PENDING, DELIVERED, READ).")

    add_h2("5.2 Service Layer Implementation")
    add_p("The backend logic is encapsulated across three service classes:")
    add_bullet("AuthService: Manages user registration, BCrypt password matching, token generation via JwtService, and user session logout.")
    add_bullet("MessageService: Handles store-and-forward message persistence, conversation history retrieval using custom JPQL queries, and delivery status transitions.")
    add_bullet("UserService: Manages user directory listings, profile updates, and secure password changes.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 6: FRONTEND ARCHITECTURE & USER INTERFACE DESIGN
    # ---------------------------------------------------------
    add_h1("CHAPTER 6: FRONTEND ARCHITECTURE & USER INTERFACE DESIGN")
    add_p("The frontend of NeoChat is built as a single-page application using React.js and Vite, featuring a modern Neumorphic visual design system.")

    add_h2("6.1 Application Structure & Routing")
    add_p("The client application uses react-router-dom to manage four core page views:")
    add_bullet("LoginPage (`/login`): Form for user authentication with error handling and link to registration.")
    add_bullet("RegisterPage (`/register`): Form for new account creation with username, email, and password fields.")
    add_bullet("ChatPage (`/chat`): Main messaging hub displaying user list, active chat window, and message input bar.")
    add_bullet("ProfilePage (`/profile`): User account overlay for updating profile details, changing passwords, and signing out.")

    add_h2("6.2 State Management & Context API")
    add_p("Global authentication state is managed via AuthContext.jsx. The context stores currentUser, token, and provides login(), register(), logout(), and updateUser() functions.")
    add_p("Tokens and user credentials are saved in localStorage (neochat_token and neochat_user) to preserve session state across page refreshes.")

    add_h2("6.3 Neumorphic UI Design System")
    add_p("The user interface implements a Neumorphic design language defined in neu.css. Soft inset and drop shadows create tactile, extruded UI elements, providing a sleek aesthetic for buttons, input fields, cards, and message bubbles.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 7: REAL-TIME MESSAGING ENGINE
    # ---------------------------------------------------------
    add_h1("CHAPTER 7: REAL-TIME MESSAGING ENGINE & DELIVERY STATE MACHINE")
    add_p("A distinguishing feature of NeoChat is its transparent multi-state message delivery tracking system.")

    add_h2("7.1 Message Delivery State Machine")
    add_p("Every message transitions through three explicit states:")
    add_bullet("State 1: PENDING — Assigned immediately when the server receives the message and persists it to the database.")
    add_bullet("State 2: DELIVERED — Assigned when the recipient's client receives the message payload via WebSocket or REST history sync.")
    add_bullet("State 3: READ — Assigned when the recipient opens the conversation and views the message on screen.")

    add_h2("7.2 Real-Time Status Propagation")
    add_p("Status changes are updated in the database by MessageService.updateStatus() and emitted instantly to the sender's client via WebSocket. MessageBubble.jsx renders distinct visual icons for each status: single checkmark for Pending, double checkmarks for Delivered, and double blue checkmarks for Read.")

    add_h2("7.3 Offline Message Synchronization")
    add_p("When a user reconnects after being offline, apiService.getHistory(contactId) retrieves all missed messages from PostgreSQL. Messages with status PENDING automatically transition to DELIVERED, providing seamless sync.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 8: AUTOMATED TESTING & QA
    # ---------------------------------------------------------
    add_h1("CHAPTER 8: AUTOMATED TESTING, QUALITY ASSURANCE & VERIFICATION")
    add_p("To ensure system stability, security compliance, and regression resistance, NeoChat includes a comprehensive automated test suite consisting of 82 test cases.")

    add_h2("8.1 Backend Automated Testing (39 Tests Passed)")
    add_p("Backend tests were developed using JUnit 5, Mockito, and Spring MockMvc across five test classes:")
    add_bullet("AuthControllerTest (6 Tests): Validates REST controllers, payload validation (400 Bad Request), and registration/login HTTP responses (200 OK).")
    add_bullet("AuthServiceTest (8 Tests): Tests registration, BCrypt password encoding, login verification, duplicate checks, and logout state changes.")
    add_bullet("MessageServiceTest (8 Tests): Tests message creation, store-and-forward persistence, status transitions, and conversation history fetching.")
    add_bullet("UserServiceTest (11 Tests): Tests contact filtering, profile modifications, password change security, and online status mapping.")
    add_bullet("JwtServiceTest (5 Tests): Tests HMAC-SHA256 token generation, UUID extraction round-trips, and signature tampering detection.")
    add_bullet("BackendApplicationTests (1 Test): Verifies full Spring Boot context loading.")

    add_h2("8.2 Frontend Automated Testing (43 Tests Passed)")
    add_p("Frontend tests were executed using Vitest and React Testing Library across seven test files:")
    add_bullet("apiService.test.js (16 Tests): Mocks HTTP fetch requests to test REST integration, Bearer header injection, token storage, and response mapping.")
    add_bullet("LoginPage.test.jsx (5 Tests): Validates UI elements, input bindings, and navigation links.")
    add_bullet("RegisterPage.test.jsx (4 Tests): Validates registration form inputs and submit actions.")
    add_bullet("ChatPage.test.jsx (3 Tests): Validates auth routing protection and main chat interface.")
    add_bullet("ProfilePage.test.jsx (5 Tests): Validates profile edit actions, password updates, and sign-out controls.")
    add_bullet("UserList.test.jsx (5 Tests): Validates search filtering, contact selection, and unread badges.")
    add_bullet("MessageBubble.test.jsx (5 Tests): Validates sent/received bubble rendering, timestamp formatting, and status icons.")

    add_p("Overall, all 82 tests achieved a 100% pass rate with zero failures.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 9: DEPLOYMENT & SELF-HOSTING GUIDELINES
    # ---------------------------------------------------------
    add_h1("CHAPTER 9: DEPLOYMENT, CONTAINERIZATION & SELF-HOSTING GUIDELINES")
    add_p("NeoChat is designed for straightforward self-hosting on private servers, virtual private servers (VPS), or local infrastructure.")

    add_h2("9.1 Prerequisites")
    add_bullet("Java Development Kit (JDK) 21 or later.")
    add_bullet("Node.js 18+ and npm package manager.")
    add_bullet("PostgreSQL relational database server.")

    add_h2("9.2 Backend Deployment Steps")
    add_p("1. Configure database connection parameters in backend/src/main/resources/application.yml.")
    add_p("2. Build executable JAR file: ./mvnw clean package -DskipTests.")
    add_p("3. Execute production application: java -jar target/backend-0.0.1-SNAPSHOT.jar.")

    add_h2("9.3 Frontend Deployment Steps")
    add_p("1. Install dependencies: npm install.")
    add_p("2. Configure reverse proxy in vite.config.js to route `/api` and `/ws` to `localhost:8080`.")
    add_p("3. Launch development server (npm run dev) or build static bundle (npm run build).")

    doc.add_page_break()

    # ---------------------------------------------------------
    # CHAPTER 10: CONCLUSION & FUTURE ROADMAP
    # ---------------------------------------------------------
    add_h1("CHAPTER 10: CONCLUSION & FUTURE ARCHITECTURAL ENHANCEMENTS")
    add_h2("10.1 Project Summary")
    add_p("The NeoChat project successfully delivers a full-stack real-time messaging solution that resolves the core issues of silent message loss, delivery opacity, and platform lock-in. By coupling a React.js presentation layer with a Java Spring Boot backend and PostgreSQL database, NeoChat guarantees reliable store-and-forward message delivery and multi-state tracking.")

    add_h2("10.2 Future Enhancement Roadmap")
    add_p("Future development iterations will expand upon the current architecture through the following technical additions:")
    add_bullet("End-to-End Encryption (E2EE): Implementing Signal Protocol for client-side encryption.")
    add_bullet("Group Messaging & Rooms: Extending database schema and STOMP channels to support multi-user chat rooms.")
    add_bullet("Media & Attachment Support: Integrating AWS S3 / MinIO object storage for image and file sharing.")
    add_bullet("Voice & Video Calling: Integrating WebRTC protocols for peer-to-peer audio and video calls.")

    doc.add_page_break()

    # ---------------------------------------------------------
    # APPENDIX A & B: API REFERENCES AND TABLES
    # ---------------------------------------------------------
    add_h1("APPENDIX A: COMPLETE REST API SPECIFICATIONS")
    add_p("The following table documents all production REST endpoints exposed by the NeoChat Spring Boot backend:")

    table = doc.add_table(rows=1, cols=4)
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = 'Method'
    hdr_cells[1].text = 'Endpoint URL'
    hdr_cells[2].text = 'Auth Required'
    hdr_cells[3].text = 'Description'

    endpoints = [
        ('POST', '/api/auth/register', 'No', 'Registers new user account with BCrypt password hashing'),
        ('POST', '/api/auth/login', 'No', 'Authenticates credentials and returns JWT Bearer token'),
        ('POST', '/api/auth/logout', 'Yes', 'Invalidates session and sets user offline'),
        ('GET', '/api/users', 'Yes', 'Fetches directory of registered users excluding self'),
        ('GET', '/api/users/{id}', 'Yes', 'Retrieves user details by UUID'),
        ('PUT', '/api/users/profile', 'Yes', 'Updates current user username and email'),
        ('PUT', '/api/users/password', 'Yes', 'Changes user password after old password validation'),
        ('POST', '/api/messages/send', 'Yes', 'Persists message to DB with Pending status and dispatches'),
        ('GET', '/api/messages/{userId}', 'Yes', 'Retrieves conversation history between two users'),
        ('PUT', '/api/messages/{id}/status', 'Yes', 'Updates message status (Pending -> Delivered -> Read)'),
    ]

    for method, url, auth, desc in endpoints:
        row_cells = table.add_row().cells
        row_cells[0].text = method
        row_cells[1].text = url
        row_cells[2].text = auth
        row_cells[3].text = desc

    doc.add_paragraph('')
    add_h1("APPENDIX B: AUTOMATED TEST EXECUTION SUMMARY")
    add_p("Summary of automated test suites executed across backend and frontend codebases:")

    test_table = doc.add_table(rows=1, cols=4)
    t_hdr = test_table.rows[0].cells
    t_hdr[0].text = 'Suite Name'
    t_hdr[1].text = 'Framework'
    t_hdr[2].text = 'Total Tests'
    t_hdr[3].text = 'Pass Rate'

    test_summary = [
        ('Backend Auth Controller', 'Spring MockMvc', '6', '100% Pass (6/6)'),
        ('Backend Auth Service', 'JUnit 5 + Mockito', '8', '100% Pass (8/8)'),
        ('Backend Message Service', 'JUnit 5 + Mockito', '8', '100% Pass (8/8)'),
        ('Backend User Service', 'JUnit 5 + Mockito', '11', '100% Pass (11/11)'),
        ('Backend JWT Service', 'JUnit 5', '5', '100% Pass (5/5)'),
        ('Backend Context Test', 'SpringBootTest', '1', '100% Pass (1/1)'),
        ('Frontend API Service', 'Vitest', '16', '100% Pass (16/16)'),
        ('Frontend UI Pages', 'Vitest + RTL', '17', '100% Pass (17/17)'),
        ('Frontend Components', 'Vitest + RTL', '10', '100% Pass (10/10)'),
    ]

    for sname, fwork, count, status in test_summary:
        r_cells = test_table.add_row().cells
        r_cells[0].text = sname
        r_cells[1].text = fwork
        r_cells[2].text = count
        r_cells[3].text = status

    # Save document
    doc_path = '/home/luffy/Desktop/chatApplication/MukeshBalaji_ChatApplication_Documentation.docx'
    doc.save(doc_path)
    print("Documentation created successfully at:", doc_path)

if __name__ == '__main__':
    create_document()
