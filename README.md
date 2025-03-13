# mc-panel
built off of itzg's docker minecraft container

# deployment

**DISCAMER: THIS IS NOT MEANT TO BE USED IN A PUBLIC ENVIROMENT**
It is recommended to only use this in a local enviroment, there are minimal security features present so expose this processs under your own discretion.

- Make sure you have Docker installed
- Pull the image from docker hub `docker pull user:very-real-img`
- Run the container `docker run -n simple-mc-panel -d user:very-real-img -p 3000:3000`
- And you're done! Access the panel at localhost:3000 or your chosen ip and port 


# todo
 - [ ] fix container stream
 - [ ] add sdtin commands
 - [ ] add port allocation panel 
 - [x] fix ram & cpu displays
 - [ ] finish file explorer 
 - [ ] finish modrinth implementation 
 - [x] patch security issues
 - [ ] create working deployment build in docker