import runpod

def handler(event):
    # your logic
    return {"result": "success"}

runpod.serverless.start({
    "handler": handler
})
