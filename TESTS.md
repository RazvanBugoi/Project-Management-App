# Testing Methodology

## Overview
The application uses Jest as the testing framework with a focus on unit and integration testing. Tests are organized by model/component and follow a consistent pattern to ensure comprehensive coverage.

## Test Structure

### Model Tests
Each model has its own test file in `backend/tests/models/` following these patterns:

1. **CRUD Operations**
   - Create: Test successful creation and validation errors
   - Read: Test retrieval of single and multiple records
   - Update: Test successful updates and constraint violations
   - Delete: Test deletion and referential integrity

2. **Validation Tests**
   - Required fields
   - Format constraints
   - Unique constraints
   - Foreign key constraints

3. **Business Logic Tests**
   - Status transitions
   - Conditional validations
   - Computed fields

### Test Setup
- Each test suite uses its own isolated database context
- Tables are cleaned before each test
- Foreign key relationships are handled in correct order
- Environment variables are properly configured for testing

## Phase 1 Test Coverage (✅ Completed)

### Project Model (`project.test.js`) - 14 Tests
1. **Creation Tests** ✅
   - Create with valid data
   - Validate project code format
   - Prevent duplicate project code
   - Prevent duplicate project name

2. **Retrieval Tests** ✅
   - Get all projects
   - Filter archived projects
   - Get by project code
   - Handle non-existent project

3. **Update Tests** ✅
   - Update project details
   - Handle non-existent project
   - Prevent duplicate names

4. **Archive Tests** ✅
   - Archive project
   - Unarchive project
   - Handle non-existent project

### Topic Area Model (`topic-area.test.js`) - 11 Tests
1. **Creation Tests** ✅
   - Create with valid data
   - Prevent duplicates

2. **Retrieval Tests** ✅
   - Get all topic areas
   - Get by ID
   - Handle non-existent ID

3. **Update Tests** ✅
   - Update topic area
   - Handle non-existent topic area
   - Prevent duplicate names

4. **Delete Tests** ✅
   - Delete topic area
   - Handle non-existent topic area
   - Prevent deletion when referenced

### Application Model (`application.test.js`) - 18 Tests
1. **Creation Tests** ✅
   - Create with valid data
   - Validate project reference
   - Validate topic area reference
   - Validate status constraints

2. **Retrieval Tests** ✅
   - Get all applications
   - Filter by project
   - Get by application ID
   - Include related data

3. **Update Tests** ✅
   - Update application details
   - Status transitions
   - Archive functionality

4. **Status Tests** ✅
   - Development status handling
   - Determination status handling
   - Withdrawn status with reason
   - Determined status with outcome
   - Status-specific field validations

## Phase 2 Test Requirements (🚧 In Progress)

### Quote Model Tests (✅ Completed) - 18 Tests
1. **Creation Tests** ✅
   - Create quote with valid data
   - Validate application reference (foreign key)
   - Validate consultant reference (foreign key)
   - Validate quote status constraints
   - Prevent invalid status values
   - Validate status-specific field requirements

2. **Retrieval Tests** ✅
   - Get all quotes with related data
   - Filter by application
   - Filter by status
   - Get by quote ID
   - Handle non-existent quote
   - Include related project and consultant data

3. **Update Tests** ✅
   - Update quote details
   - Status transitions validation
   - Required fields for status changes
   - Fee and date validations
   - Handle non-existent quote

4. **Status-Specific Tests** ✅
   - Requested status constraints (no date/fee)
   - Received status requirements (date/fee required)
   - Instructed status validation (must be Received first)
   - Delete restrictions for Instructed quotes

### Instruction Model Tests (✅ Completed) - 14 Tests
1. **Creation Tests** ✅
   - Create instruction with valid data
   - Validate quote reference
   - Validate date constraints
   - Handle duplicate prevention

2. **Retrieval Tests** ✅
   - Get all instructions with related data
   - Filter by work delivered status
   - Filter by project code
   - Get by instruction ID
   - Handle non-existent instruction
   - Include related quote and project data

3. **Update Tests** ✅
   - Update instruction details
   - Work delivery status and time tracking
   - Date validations
   - Handle non-existent instruction
   - Update only allowed fields

### User Model Tests (✅ Completed) - 15 Tests
1. **Authentication Tests** ✅
   - User registration with password hashing
   - Email format validation
   - Password strength requirements
   - Duplicate email prevention
   - Login with valid credentials
   - Login failure with wrong password
   - Login failure with non-existent email

2. **Authorization Tests** ✅
   - Token verification
   - Invalid token rejection
   - Role-based permissions

3. **Profile Tests** ✅
   - Update user details
   - Password changes
   - Password change validation
   - Profile retrieval
   - Non-existent user handling

### Integration Tests (🚧 In Progress)
1. **Application-Quote Flow** ✅
   - Create application and related quotes
     - Multiple quotes per application ✓
     - Foreign key constraints ✓
   - Status transitions across entities
     - Quote status progression ✓
     - Application status updates ✓
     - Invalid transition prevention ✓
   - Constraint validations
     - Application-quote relationships ✓
     - Data consistency enforcement ✓
     - Business rule validations ✓

2. **Quote-Instruction Flow** ✅
    - Quote acceptance to instruction creation ✓
      - Validate quote status ✓
      - Prevent duplicates ✓
    - Work delivery tracking ✓
      - Status updates ✓
      - Completion time ✓
    - Time calculations ✓
      - Days overdue ✓
      - Early delivery handling ✓

3. **File Upload Tests** ✅
   - Quote PDF upload ✓
   - File type validation ✓
     - Accept PDF files ✓
     - Reject non-PDF files ✓
   - Size restrictions ✓
     - Accept files under limit ✓
     - Reject files over limit ✓
   - Error handling ✓
     - Missing file handling ✓
     - Invalid file types ✓
     - Size limit errors ✓

## Test Execution
```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/models/project.test.js

# Run tests with coverage
npm test -- --coverage
```

## Coverage Requirements
- Minimum 80% line coverage
- Minimum 70% branch coverage
- Critical paths must have 100% coverage:
  - Status transitions
  - Financial calculations
  - File operations
  - Security-related functionality

## Progress Summary
- ✅ Phase 1: 43 tests completed across 3 core models
- ✅ Phase 2: Quote model tests completed (18 tests)
- ✅ Phase 2: Instruction model tests completed (14 tests)
- ✅ Phase 2: User model tests completed (15 tests)
- 🚧 Integration Tests:
  - ✅ Application-Quote Flow completed (6 tests)
    - Application creation with quotes (2 tests)
    - Status transitions (2 tests)
    - Constraint validations (2 tests)
  - ✅ Quote-Instruction Flow completed (7 tests)
    - Instruction creation (3 tests)
    - Work delivery tracking (2 tests)
    - Time calculations (2 tests)
  - ✅ File Upload tests completed (7 tests)
    - File type validation (2 tests)
    - Size restrictions (2 tests)
    - Error handling (3 tests)