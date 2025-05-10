import { Router } from "express"
import { makeAdmin } from "../controllers/adminControllers/makeAdmin.js"
import { requestBook } from "../controllers/adminControllers/approveRequest.js"
import { getRequests } from "../controllers/adminControllers/getrequests.js"
import { updateBorrowStatus } from "../controllers/adminControllers/approveBorrow.js"
const adminrouter = Router()

adminrouter.post("/makeAdmin", makeAdmin)
adminrouter.post("/requestBook",requestBook)
adminrouter.get("/getRequests",getRequests)
adminrouter.post("/updateBorrowStatus",updateBorrowStatus)

export default adminrouter
