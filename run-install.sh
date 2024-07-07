#!/bin/sh
printf "\033]0;Installer\007"
clear
rm *.bat

# Function to create or activate a virtual environment
prepare_install() {
    if [ -d ".venv" ]; then
        echo "Venv found. This implies Applio has already been installed or this is a broken install."
        . .venv/bin/activate
    else
        echo "Creating venv..."
        requirements_file="requirements.txt"
        echo "Checking if Python exists..."
        if command -v python3.10 > /dev/null 2>&1; then
            py=$(which python3.10)
            echo "Using Python 3.10"
        else
            if python --version | grep -qE "3\.(7|8|9|10)\."; then
                py=$(which python)
                echo "Using Python"
            else
                echo "Please install Python 3 or 3.10 manually."
                exit 1
            fi
        fi

        $py -m venv .venv
        . .venv/bin/activate
        python -m ensurepip
        # Update pip within the virtual environment
        pip3 install --upgrade pip
        echo
        echo "Installing Applio dependencies..."
        python -m pip install -r requirements.txt
        python -m pip uninstall torch torchvision torchaudio -y
        python -m pip install torch==2.1.1 torchvision==0.16.1 torchaudio==2.1.1 --index-url https://download.pytorch.org/whl/cu121
        finish
    fi
}

# Function to finish installation (this should install missing dependencies)
finish() {
    # Check if required packages are installed and install them if not
    if [ -f "${requirements_file}" ]; then
        installed_packages=$(python -m pip freeze)
        while IFS= read -r package; do
            expr "${package}" : "^#.*" > /dev/null && continue
            package_name=$(echo "${package}" | sed 's/[<>=!].*//')
            if ! echo "${installed_packages}" | grep -q "${package_name}"; then
                echo "${package_name} not found. Attempting to install..."
                python -m pip install --upgrade "${package}"
            fi
        done < "${requirements_file}"
    else
        echo "${requirements_file} not found. Please ensure the requirements file with required packages exists."
        exit 1
    fi
    clear
    echo "Applio has been successfully downloaded. Run the file run-applio.sh to run the web interface!"
    echo "To re-install, please delete the existing '.venv' directory and run this script again."
    echo "Giving execute permissions to run-applio.sh..."
    chmod +x run-applio.sh
    ./run-applio.sh
    exit 0
}

# Main script execution begins here
prepare_install
