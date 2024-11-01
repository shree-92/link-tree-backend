class ApiError extends Error {
    constructor(
        statuscode,
        message="default error message Oh No something went wrong welp me senpai",
        errors = [], // if multiple errors
        stack = "",
    ){
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}