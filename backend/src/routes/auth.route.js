import { Router } from "express";

const router = Router();

router.get('/sigin',(req,res)=>{
  res.send('sigin route');
})

export default router;