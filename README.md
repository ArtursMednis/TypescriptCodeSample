# Mortar Calculator

Welcome to the Mortar Calculator repository! This TypeScript application
comprises two main parts: the logic and the user interface (UI). The
logic is encapsulated in the "mortar_logic" folder, which includes a
comprehensive set of tests to ensure its reliability. The UI is
implemented in the "mortar_browser" folder using React.js.

## Project Structure

- **mortar_logic**: This folder contains the core logic of the Mortar
  Calculator, along with a suite of tests to verify its functionality.
  To run the tests, execute the following commands:  
  `npm install`  
  `npm test`

- **mortar_browser**: The UI component of the application is located
  here, implemented in React.js. To run the UI, use the following
  commands:  
  `npm install`  
  `npm start`

## Deviations from Common Practices

There are intentional deviations from common practices in this project.
These were made with the goal of ensuring that the code is reusable for
a React Native application, without being tightly coupled with the web
browser. Although a React Native application is not present in this
repository, the codebase is designed to facilitate its integration
seamlessly.

## Getting Started

To get started with the Mortar Calculator, follow these steps:

1\. Clone the repository:

    `git clone https://github.com/ArtursMednis/TypescriptCodeSample.git`

2\. Navigate to the project directory:

    `cd TypescriptCodeSample`

3\. Set up and run the logic tests:
	
    `cd mortar_logic`
    `npm install`
    `npm test`

4\. Set up and run the UI:

    `cd ../mortar_browser`

    `npm install`

    `npm start`

5\. Open your browser and go to http://localhost:3000/ to interact with the Mortar Calculator UI.

## Project Status

The Mortar Calculator is a work in progress. While the application is
functional, please note that it is not yet complete, and CSS styling has
not been implemented. This repository is primarily intended for
employers to assess my coding style, and I do not expect or encourage
contributions.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or feedback, please contact arturs.mednis0@gmail.com
