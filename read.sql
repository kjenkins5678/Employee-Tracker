SELECT 
employees.id, 
employees.first_name, 
employees.last_name, 
roles.title,
departments.name as department,
roles.salary
FROM employees 
INNER JOIN roles ON employees.role_id = roles.id
INNER JOIN departments ON roles.department_id = departments.id;