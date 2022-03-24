INSERT INTO department (name)
VALUES  ("Plumbing"),
        ("Adventuring"),
        ("Spice Harvesting"),
        ("Legal");


INSERT INTO role (title, salary, dept_id)
VALUES  ("Plumber", 75000.00, 1),
        ("Princess", 500000.00, 1),
        ("Toadstool", 50000.00, 1),
        ("Party Leader", 200000.00, 2),
        ("Fighter", 90000.00, 2),
        ("Wizard", 100000.00, 2),
        ("Thief", 65000.00, 2),
        ("Cleric", 80000.00, 2),
        ("Duke", 400000.00, 3),
        ("Baron", 400000.00, 3),
        ("Heir", 150000.00, 3),
        ("Emperor", 1000000.00, 3),
        ("Defense Attorney", 200000.00, 4),
        ("Prosecuter", 200000.00, 4),
        ("Legal Assistant", 50000.00, 4);
        

INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES  ("Mario", "Mario", 1, 3, 0),
        ("Luigi", "Mario", 1, 3, 0),
        ("Princess", "Peach", 2, 3, 1),
        ("Toad", "Stool", 3, 3, 0),
        ("Dungeon", "Master", 4, 5, 1),
        ("Punchy", "McThrowdown", 5, 5, 0),
        ("Steve", "Castsalot", 6, 5, 0),
        ("Sneaky", "Nothingtoseehere", 7, 5, 0),
        ("Sir", "Overlyrighteous", 8, 5, 0),
        ("Leto", "Atreides", 9, 13, 1),
        ("Paul", "Atreides", 11, 10, 0),
        ("Vladimir", "Harkonnen", 10, 13, 1),
        ("Shaddam", "Corrino", 12, 13, 1),
        ("Phoenix", "Wright", 13, 14, 1),
        ("Mia", "Fey", 15, 14, 0),
        ("Miles", "Edgeworth", 14, 16, 1),
        ("Maya", "Fey", 15, 16, 0);