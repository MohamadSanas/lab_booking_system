CREATE TABLE users (
	ID VARCHAR(20) PRIMARY KEY,
    password VARCHAR(100),
    role ENUM("student","Technical_Officer","Lecturer","Instructor","Managment_Staff") NOT NULL
    
);

CREATE TABLE department(
	DeptID VARCHAR(20) PRIMARY KEY ,
    DeptName VARCHAR(100) NOT NULL
);

CREATE TABLE subjects(
	course_code VARCHAR(6) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    credit INT NOT NULL,
    Dept_ID VARCHAR(20),
    FOREIGN KEY (Dept_ID) REFERENCES department(DeptID)
);

CREATE TABLE Laboratory (
	Lab_code VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Dept_ID VARCHAR(20) NOT NULL,
    FOREIGN KEY (Dept_ID) REFERENCES department(DeptID)
);

CREATE TABLE Practical_info(
	Practical_ID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Subject_ID VARCHAR(6),
    FOREIGN KEY (Subject_ID) REFERENCES subjects(course_code)
);

CREATE TABLE Instruments_info(
	Instrument_code VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Quantity INT NOT NULL,
    Lab_code VARCHAR(10) NOT NULL,
    FOREIGN KEY (Lab_code) REFERENCES Laboratory(Lab_code)
);


CREATE TABLE student(
	ID VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    gender ENUM("Male","Female","Other"),
    Dept_ID VARCHAR(20) NOT NULL,
    phone_num VARCHAR(12),
    personal_mail VARCHAR(50) NOT NULL,
    FOREIGN KEY (ID) REFERENCES users(ID),
    FOREIGN KEY (Dept_ID) REFERENCES department(DeptID)
);

CREATE TABLE Lecturers(
	ID VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    gender ENUM("Male","Female","Other"),
    Dept_ID VARCHAR(20) NOT NULL,
    phone_num VARCHAR(12),
    personal_mail VARCHAR(50) NOT NULL,
    FOREIGN KEY (ID) REFERENCES users(ID),
    FOREIGN KEY (Dept_ID) REFERENCES department(DeptID)
);

CREATE TABLE Technical_officer (
	ID VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    gender ENUM("Male","Female","Other"),
    Dept_ID VARCHAR(20) NOT NULL,
    phone_num VARCHAR(12),
    personal_mail VARCHAR(50) NOT NULL,
    FOREIGN KEY (ID) REFERENCES users(ID),
    FOREIGN KEY (Dept_ID) REFERENCES department(DeptID)
);


CREATE TABLE Instructors(
	ID VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    gender ENUM("Male","Female","Other"),
    Dept_ID VARCHAR(20) NOT NULL,
    phone_num VARCHAR(12),
    personal_mail VARCHAR(50) NOT NULL,
    FOREIGN KEY (ID) REFERENCES users(ID),
    FOREIGN KEY (Dept_ID) REFERENCES department(DeptID)
);

CREATE TABLE Enrollment(
	Student_ID VARCHAR(20),
    Subject_ID VARCHAR(6),
    Lecturer_ID VARCHAR(20),
    Instructor_ID VARCHAR(20),
    FOREIGN KEY (Student_ID) REFERENCES student(ID),
    FOREIGN KEY (Subject_ID) REFERENCES subjects(course_code),
    FOREIGN KEY (Lecturer_ID) REFERENCES Lecturers(ID),
    FOREIGN KEY (Instructor_ID) REFERENCES Instructors(ID)
    
);

CREATE TABLE Practicals(
	Subject_ID VARCHAR(6),
    Practical_ID VARCHAR(10),
    Lab_code VARCHAR(10),
    To_ID VARCHAR(20),
    FOREIGN KEY (Subject_ID) REFERENCES subjects(course_code),
    FOREIGN KEY (Practical_ID) REFERENCES Practical_info(Practical_ID),
    FOREIGN KEY (Lab_code) REFERENCES Laboratory(Lab_code),
    FOREIGN KEY (To_ID) REFERENCES Technical_officer(ID)
);



    
    