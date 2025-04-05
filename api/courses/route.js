import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// This function handles GET requests to the /api/courses endpoint
export async function GET(req) {
  try {
    // Open the SQLite database
    const db = await open({
      filename: path.join(process.cwd(), 'data', 'courses.db'), // Path to the database
      driver: sqlite3.Database
    });

    // Fetch all courses from the database
    const courses = await db.all('SELECT * FROM courses'); // Adjust the query as needed
    if (!courses) {
      throw new Error('No courses found'); // Handle case where no courses are returned
    }

    // Close the database connection
    await db.close();

    // Return the courses as a JSON response
    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Return an error response if something goes wrong
    return new Response(JSON.stringify({ error: 'Failed to fetch courses' }), { status: 500 });
  }
}