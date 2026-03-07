import mongoose from 'mongoose'

const todoSchema=new mongoose.Schema(
  {
    content:{
          type:String,
          required:true
        },
    complete:{
          type:Boolean,
          default:false
        },
    createdBy:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true
    },
    subTodos:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubTodo",
        required:true
      }
    ] // array's of sub-todos reference
    
  },
  {
    timestamps:true
  }
)

const Todo=mongoose.model("Todo",todoSchema)
export default Todo;