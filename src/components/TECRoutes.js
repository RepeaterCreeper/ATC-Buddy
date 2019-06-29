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
            let departureAirport = document.querySelector("#tec_route_departure").value,
                arrivalAirport = document.querySelector("#tec_route_arrival").value;
            
            if (departureAirport.length > 3) departureAirport = departureAirport.slice(1);
            if (arrivalAirport.length > 3) arrivalAirport = arrivalAirport.slice(1);
        
            if (departureAirport.length > 0 && arrivalAirport.length > 0) {
                let results = TEC_ROUTES.filter((data) => {
                    if (data.departure.includes(departureAirport) && data.arrival.includes(arrivalAirport)) return data;
                });
                this.results = results;
            } else {
                let results = TEC_ROUTES.filter((data) => {
                    if (departureAirport.length > 0) {
                        if (data.departureAirport.includes(departureAirport)) return data;
                    } else {
                        if (data.arrivalAirport.includes(arrivalAirport)) return data;
                    }
                });
                this.results = results;
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