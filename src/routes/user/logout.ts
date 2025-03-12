import express,{ Router, Request, Response } from "express";
const router = Router();
router.use(express.json());

router.get("/",async (res:Response)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:"User Logged Out!",
    });
    return;
});

export default router;