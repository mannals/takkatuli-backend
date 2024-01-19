DROP DATABASE IF EXISTS ForumApp;
CREATE DATABASE ForumApp;
USE ForumApp;

-- Table creation

CREATE TABLE UserLevels (
    level_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

CREATE TABLE Users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_level_id INT DEFAULT 2, 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

CREATE TABLE Categories (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Threads (
    thread_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    filename VARCHAR(255),
    filesize INT,
    media_type VARCHAR(255),
    is_poll BOOLEAN,
    title VARCHAR(255) NOT NULL,
    text_content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE PollOptions (
    option_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES Threads(thread_id)
);

CREATE TABLE PollOptionVotes (
    vote_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    option_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (option_id) REFERENCES PollOptions(option_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE ThreadLikes (
    like_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES Threads(thread_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Replies (
    reply_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    thread_id INT NOT NULL,
    user_id INT NOT NULL,
    filename VARCHAR(255),
    filesize INT,
    media_type VARCHAR(255),
    reply_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES Threads(thread_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE ReplyLikes (
    like_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reply_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reply_id) REFERENCES Replies(reply_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User'), ('Guest');

