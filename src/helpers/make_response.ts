function make_response(error: boolean, result: any) {
    if (error)
        return {
            error: error,
            message: result
        }

    return {
        error: error,
        data: result
    }
}

export default make_response;

