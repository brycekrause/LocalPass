import random
import json

# colors
import colorama
from colorama import Fore, Style

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
def login():
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
                if password == line['Pass']:
                    access = True
                    print(f'Welcome back {username}!')
                    main()
                else:
                    print('\nwrong password')
                    login()
            else:
                print('\ninvalid username')
                login()
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
        login()

def view():
    with open('data.json') as file:
        data = json.load(file)
    for line in data:
        print(f"Service: {line['Service']}")
        print(f"Username: {line['User']}")
        print(f"Password: {line['Pass']}")
    main()

def register():
    service = input('What service is it? ')
    username = input('What is your username? ')
    password = input('What is your password? ')
    with open('data.json') as file:
        data = json.load(file)
        data.append({
            "Service": service,
            "User": username,
            "Pass": password
        })
        with open('data.json', 'w') as json_file:
            json.dump(data, json_file, 
                                indent=4,  
                                separators=(',',': '))
    main()

def remove():
    print('helo worldd')

def main():
    services = []
    with open('data.json') as file:
        data = json.load(file)
    for line in data:
        services.append(line['Service'])
    print(f'\nYou have {len(services)-1} services registered.\nWhat would you like to do?')
    print('[1] View credentials\n[2] Register a new service\n[3] Remove a service')
    select = input('> ')
    if select == "1":
        view()
    elif select == "2":
        register()
    elif select == "3":
        remove()
    else:
        print('invalid entry')
        main()

login()