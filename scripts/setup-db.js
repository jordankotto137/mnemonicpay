const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase configuration")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Read and execute the SQL setup script
    const sqlPath = path.join(__dirname, "..", "scripts", "setup-database.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    // Split by semicolon and execute each statement
    const statements = sql.split(";").filter((stmt) => stmt.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc("exec_sql", { sql: statement })
        if (error) {
          console.error("Error executing SQL:", error)
        }
      }
    }

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
