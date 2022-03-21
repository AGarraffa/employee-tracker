INSERT INTO department (name)
VALUES  ("Development"),
        ("Design"),
        ("Production"),
        ("Accounting"),
        ("Legal");


INSERT INTO role (title, salary, dept_id)
VALUES  ("Legal Intern", 45000.00, 5),
        ("Engineer", 80000.00, 3),
        ("Graphic Designer", 80000.00, 2),
        ("Dev Manager", 100000.00, 1),
        ("Des Manager", 100000.00, 2),
        ("Prod Manager", 100000.00, 3);
        

INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES  ("John", "Doe", 4, null, 1),
        ("Jane", "Doe", 6, null, 1),
        ("Jim", "Doe", 2, 1, 0),
        ("Steve", "Boe", 3, 5, 0),
        ("Des", "Man", 5, null, 1),
        ("Test", "Last", 3, 5, 0);