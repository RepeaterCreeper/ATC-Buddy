const TECRoutes = {
    data: function() {
        return {
            results: []
        }
    },
    template: fs.readFileSync(path.join(__dirname, "./TecRoutes.html"), "utf-8"),
    methods: {
        changeData: function(key, value) {
            this.key = value;
        },
        getData: function(key) {
            return this.key
        },
        findTecRoute: function() {
            let departureAirport = document.querySelector("#tec_route_departure"),
                arrivalAirport = document.querySelector("#tec_route_arrival"),
                departureAirportValue = departureAirport.value,
                arrivalAirportValue = arrivalAirport.value;
            
            if (departureAirportValue.length > 3) departureAirportValue = departureAirportValue.slice(1);
            if (arrivalAirportValue.length > 3) arrivalAirportValue = arrivalAirportValue.slice(1);
        
            if (departureAirportValue.length > 0 && arrivalAirportValue.length > 0) {
                let results = TEC_ROUTES.filter((data) => {
                    if (data.departure.includes(departureAirportValue) && data.arrival.includes(arrivalAirportValue)) return data;
                });

                this.results = results;
            } else {
                if (departureAirportValue.length == 0) departureAirport.classList.add("invalid");
                if (arrivalAirportValue == 0) arrivalAirport.classList.add("invalid");
            }
        },
        /**
         * Turn TEC altitude to a more standard format
         * @param {string} unparsedAltitude 
         */
        formatAltitude(unparsedAltitude) {
            let altitudeMatch = new RegExp(/[JMPQ]+[0-9]+/g),
                tecAltitudes = unparsedAltitude.match(altitudeMatch),
                parsed = [];

            tecAltitudes.forEach((data) => {
                parsed.push(data);
            });

            return parsed.join(", ");
        }
    }
};

module.exports = TECRoutes;