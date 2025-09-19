
import json

file_path = "/Users/somethinginmy/Desktop/farming mate (09.16)/src/data/db.json"

# Define DEFAULT_IMAGE_URL as it's used in the application
DEFAULT_IMAGE_URL = "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAyMjRfNjMg%2FMDAxNjc3MTc5OTYzNjA5.5whsGhVMH-6zPg09YYDrxzkqK5VaLD5-ZFbwV9bCUHYg.nu1zp5-rSmYSoAAKsAHNg6z6MHBKchUViu2hoXwtHX8g.PNG.npay1%2FSmartSelect%25A3%25DF20230224%25A3%25DF040323%25A3%25DFGallery.png&type=a340"

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for user in data['users']:
    if user['role'] == 'farmer':
        # Ensure both profileImageUrl and avatarUrl are consistent
        if not user.get('profileImageUrl') and user.get('avatarUrl'):
            user['profileImageUrl'] = user['avatarUrl']
        elif not user.get('avatarUrl') and user.get('profileImageUrl'):
            user['avatarUrl'] = user['profileImageUrl']
        elif not user.get('profileImageUrl') and not user.get('avatarUrl'):
            user['profileImageUrl'] = DEFAULT_IMAGE_URL
            user['avatarUrl'] = DEFAULT_IMAGE_URL

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Successfully standardized farmer profile image URLs in db.json")
