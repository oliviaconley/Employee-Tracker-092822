--selecting the ID column in the dept table into the role table 
SELECT department.id as department_id, role.department_id

--insert the id column in role table into the employee role id column as the name role_id
SELECT role.id as role_id, employee.role_id

--add specific manager IDs to the manager ID column from the employee ID column in the same table (employee)