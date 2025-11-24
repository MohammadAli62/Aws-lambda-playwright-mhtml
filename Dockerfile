FROM public.ecr.aws/lambda/nodejs:18

# Install system dependencies for Playwright
RUN yum install -y \
    atk \
    at-spi2-atk \
    alsa-lib \
    cups-libs \
    libXcomposite \
    libXcursor \
    libXdamage \
    libXext \
    libXi \
    libXrandr \
    libXScrnSaver \
    libXtst \
    pango \
    libxkbcommon \
    mesa-libEGL \
    mesa-libGLES \
    && yum clean all

WORKDIR /var/task

COPY package*.json ./

RUN npm install --production playwright

# Download Playwright browser binaries (Chromium, Firefox, WebKit)
RUN npx playwright install

COPY . .

CMD ["index.handler"]