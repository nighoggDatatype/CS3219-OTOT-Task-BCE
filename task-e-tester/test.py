import requests
resp = requests.post(
    'http://localhost:8080/api/taskE/shoppingCart', 
    data={'username': 'test'})

print()

id = resp.json()["id"]

cartURL = 'http://localhost:8080/api/v1/shoppingCart/' + id

resp = requests.get(cartURL)
first_hash = hash(resp.text)
first_speed = resp.elapsed.total_seconds()
print("First Request Hash:", first_hash)
print("First Request Speed:", first_speed)

print("")

resp = requests.get(cartURL)
second_hash = hash(resp.text)
second_speed = resp.elapsed.total_seconds()
print("Second Request Hash:", second_hash)
print("Second Request Speed:", second_speed)

print("")

print("Request are the same:", first_hash == second_hash)
speed_up = first_speed - second_speed
if (speed_up > 0):
    print("Speed up:", speed_up)
else:
    print("ERROR, NO SPEED UP:", speed_up)

requests.delete(cartURL)