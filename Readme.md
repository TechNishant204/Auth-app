### Steps to follow for Signup:
1. Fetch the data from the request body.
2. Validate the data.
3. Check whether the user already exists(User.findOne()) in the database.
4. If user exists, return a response with an error message.
5. If user does not exist, first encrypt(brcypt.hash(pswrd,salt)) the password using the bcrypt library.
6. If somehow password is not encrypted, return a response with an error message.
7. Create a new user(User.create) in the database using the provided data and return a response with a success message.
8. Test the API using Postman and ensure that to add correct port.
9. Create a cluster at atlas and pick the url from there and paste it inside .env file.
10. create a new connection using same url at compass and test the connection.

```
// Function to handle user signup
async function signup(req, res) {
  try {
    // Fetch data from request body
    const { username, email, password } = req.body;

    // Validate data
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await User.create({ username, email, password: hashedPassword });

    // Return success response
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: 'Error creating user', error });
  }
}
```
### Steps in Login Process:
1. Receive Login Request: The frontend sends the email and password to the login route.

2. Validate Input: Ensure the input is properly structured.

3. Authenticate User:
    Search for the user in the database.

    Use bcrypt.compare() to check if the hashed password matches.

4. Generate JWT: Use jsonwebtoken.sign() to create a token containing user info (e.g., user ID, role).

5. Send Response: Return the JWT to the user if login is successful.