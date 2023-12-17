import random
import json
import colorama
from colorama import Fore, Style

# colors
colorama.init()
magenta = Fore.MAGENTA + Style.BRIGHT
reset = Style.RESET_ALL

# such cool wow
print(f'{magenta}██      ██████  ███    ███ {reset}')
print(f'{magenta}██      ██   ██ ████  ████ {reset}')
print(f'{magenta}██      ██████  ██ ████ ██ {reset}')
print(f'{magenta}██      ██      ██  ██  ██ {reset}')
print(f'{magenta}███████ ██      ██      ██ {reset}')

# see if user is registered for LPM
registered = False
access = False
with open('data.json') as file:
    data = json.load(file)
for line in data:
    if line['Service'] == "LPM":
        registered = True
        print('Please login')
        username = input('Username: ')
        password = input('Password: ')
        if username == line['User']:
            print('\nusers match')
            if password == line['Pass']:
                print('passwords match')
                access = True
                print(f'Welcome back {username}!')
            else:
                print('\nwrong password')
        else:
            print('\ninvalid username')
if registered == False:
    print('Welcome to LPM!\nFirst, setup a username and password for LPM\nMake it SECURE.\nNote: your data will only be stored on your local system and nowhere online.')
    username = input('Set a username: ')
    password = input('Set a password: ')
    data.append({
        "Service": "LPM",
        "User": username,
        "Pass": password
    })
    with open('data.json', 'w') as json_file:
        json.dump(data, json_file, 
                            indent=4,  
                            separators=(',',': '))
if registered == True and access == True:
    services = []
    with open('data.json') as file:
        data = json.load(file)
    for line in data:
        services.append(line['Service'])
    print(services)
    print(f'\nYou have {len(services)-1} services registered.\nWhat would you like to do?')
    print('[1] View credentials\n[2] Register a new service')
    select = input('> ')



input('')