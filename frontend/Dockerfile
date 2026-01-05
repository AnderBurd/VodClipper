FROM nginx:stable-alpine
# Instead of building inside Docker, we just build locally and copy local 'dist' folder
COPY ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]