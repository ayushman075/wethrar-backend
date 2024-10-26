import { ApiResponse } from "./ApiResponse.util.js"

const asyncHandler = (resquestHandler) =>{
    return  (req,res,next) => {
          Promise.resolve(resquestHandler(req,res,next))
          .catch((err)=>{throw err})
      }
  }
  
  export {asyncHandler}