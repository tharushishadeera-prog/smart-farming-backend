import mongoose from "mongoose"
import dns from "dns"


const DB_URL = process.env.DB_URL as string

// Force using a public DNS resolver for SRV lookups when system DNS refuses
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"])
} catch (e) {
    // ignore if setServers not supported in environment
}

const mongoDB = async () => {
    try{
        await mongoose.connect(DB_URL)
        console.log("MongoDB connected")
    }catch (error){
        console.log("DB connection error:", error)
        process.exit(1)
    }
}

export default mongoDB

