# VodClipper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# [Check out the live demo here](https://vodclipper.me)
VodClipper is a full-stack web application that solves the "filler content" problem in long-form Twitch VODs. By analyzing chat metadata through a custom sliding-window algorithm, it identifies statistical engagement spikes, allowing viewers to skip directly to the best moments of an 8+ hour stream.

---
## App Preview
<img width="2558" height="1255" alt="image" src="https://github.com/user-attachments/assets/9a6d7abb-d1a3-4f10-a1ad-6049ad4c7626" />

<img width="2519" height="1244" alt="image" src="https://github.com/user-attachments/assets/4c61ac22-4161-48e1-97fe-8129e7a01c8c" />

---

## How it was built
* **Spike Detection Algorithm:** Implemented a server-side sliding window algorithm to calculate chat density and detect statistical outliers in engagement.
* **Production DevOps:** Architected a containerized environment using **Docker Compose** and **Nginx** for reverse proxying, SSL termination (Certbot), and SPA route handling.
* **CI/CD Pipeline:** Automated deployment via **GitHub Actions**, syncing code to a DigitalOcean Droplet via SSH and rebuilding containers on every push to `main`.
* **Data Persistence:** Integrated **PostgreSQL (Supabase)** to handle the storage and retrieval of millions of chat data points for historical analysis.

---

## Run it yourself

To run the app on your local machine, use the `preDeployment` branch:

```bash
git checkout preDeployment
# In /backend
npm install
npx knex migrate:latest
npm start
# In /frontend
npm install
npm run dev
