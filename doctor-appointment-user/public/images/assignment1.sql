-- inner join
 -- Retrieve a list of all orders along with the customer's company name.
 select o.order_id,c.company_name from orders o INNER JOIN customers c 
 ON o.customer_id=c.customer_id


 -- Get the order details (OrderID, ProductName, UnitPrice, Quantity) by joining the Orders and OrderDetails tables.

select o.order_id ,p.product_name,od.unit_price,od.quantity from orders o
INNER JOIN order_details od  ON o.order_id=od.order_id
INNER JOIN products p ON od.product_id=p.product_id

  -- Fetch all employees and their respective territories from the Employees and EmployeeTerritories tables.

select e.employee_id,e.first_name,et.territory_id,t.territory_description from employees e
INNER JOIN employee_territories et ON e.employee_id=et.employee_id
INNER JOIN territories t ON et.territory_id=t.territory_id

-- left join
--  Retrieve a list of all customers and their orders, including those who haven't placed any orders.

select c.*,o.* from customers c
LEFT JOIN orders o ON c.customer_id=o.customer_id

-- Display a list of products along with the total quantity sold, including products that have never been ordered.

SELECT p.product_id, p.product_name, SUM(od.quantity) AS total_quantity_sold
FROM products p
LEFT JOIN order_details od ON p.product_id = od.product_id
GROUP BY p.product_id

-- Get all suppliers and their products, including suppliers that don’t currently supply any products.

select s.company_name,s.supplier_id, p.product_id,p.product_name 
from suppliers s
LEFT JOIN products p ON s.supplier_id=p.supplier_id

-- right join 
-- Retrieve a list of all orders along with the customer's contact name, ensuring all orders are included, even if the customer’s contact name is missing.
select c.contact_name , o.order_id from customers c
RIGHT JOIN orders o ON c.customer_id=o.customer_id

-- Fetch all orders and their shippers, ensuring all orders are included, even if no shipper is assigned.

select s.* , o.* from shippers s
RIGHT JOIN orders o ON s.shipper_id=o.ship_via

-- Display all territories along with the employees assigned to them, ensuring all territories are listed.

select e.first_name, e.employee_id ,et.territory_id 
from employees e
RIGHT JOIN employee_territories et ON e.employee_id=et.employee_id

-- full outer join 
-- Retrieve a list of all customers and suppliers, including those who have no corresponding records in the other table.

select c.customer_id,c.company_name,s.supplier_id,s.company_name 
from customers c
FULL OUTER JOIN orders o ON c.customer_id=o.customer_id
FULL OUTER JOIN order_details od ON o.order_id=od.order_id
FULL OUTER JOIN products p ON od.product_id=p.product_id
FULL OUTER JOIN suppliers s ON p.supplier_id=s.supplier_id

-- Get a list of all employees and their orders, including employees who haven’t processed any orders and orders that don’t have an assigned employee.

select o.order_id,e.employee_id,e.first_name 
from orders o
FULL OUTER JOIN employees e ON o.employee_id=e.employee_id


-- Retrieve all products and their order details, ensuring that products with no orders and orders missing product details are also included.

select od.order_id , p.product_id,p.product_name 
from order_details od
FULL OUTER JOIN products p ON od.product_id=p.product_id


-- Find all pairs of employees who work in the same city (use a SELF JOIN).

select e1.employee_id,e1.first_name,e1.city,e2.employee_id,e2.first_name
from employees e1
INNER JOIN employees e2 ON e1.city=e2.city
WHERE e1.employee_id!=e2.employee_id

-- Retrieve a cross join of all categories and suppliers, showing every possible
-- Combination.

select s.supplier_id,s.company_name ,c.* from suppliers s
CROSS JOIN categories c









