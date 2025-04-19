import asyncio
import websockets
import random
import json
# create handler for each connection
async def handler(websocket, path):
    while True:
        await asyncio.sleep(.25)
        await websocket.send(json.dumps({
            'tiltPos':70+random.random(),
            'heightPos':71+random.random(),
            'rotationPos':72+random.random(),
            'gyroXAccel':random.random(),
            'gyroYAccel':74+random.random(),
            'gyroZAccel':random.random(),
            }))

start_server = websockets.serve(handler, "localhost", 8080)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
