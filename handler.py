+ import runpod

  def handler(event):
      # your logic here
      return {"status": "ok"}

+ runpod.serverless.start({
+     "handler": handler
+ })
