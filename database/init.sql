DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    predicted_class VARCHAR(255) NOT NULL,
    confidence FLOAT NOT NULL,
    all_predictions JSON,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO users (username, email, password, full_name) VALUES
('thanhluu', 'luu@gmail.com', '$2a$10$WUWrGpJSNVC0rjBUArWxlet5EOV6XA8NBx69VtBf/h7Tx0UWpsIZK', 'Thành Lưu'),
('phong', 'phong@gmail.com', '$2a$10$IBO16nyFPA3ePYNinWiWpeKDgE72ukNYdU2ZadvlcKtiqyt.UZmYK', 'Phong');
