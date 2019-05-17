<section data-section="tec_routes">
    <div class="row">
        <div class="col s12">
            <div class="row card hoverable" style="margin: 8px;">
                <div class="input-field col s12">
                    <i class="material-icons prefix">flight_takeoff</i>
                    <input id="tec_route_departure" type="text" placeholder="Departure" maxlength="4">
                </div>
                <div class="input-field col s12">
                    <i class="material-icons prefix">flight_land</i>
                    <input id="tec_route_arrival" type="text" placeholder="Arrival" maxlength="4">
                </div>
                <div class="col s12">
                    <button onClick="findTecRoute()" class="btn blue col s12" style="margin-bottom: 8px;">Search</button>
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <div class="col s12">
            <p style="font-weight: light; margin-top: 8px;">RESULTS</p>
            <div data-result-type="tec_routes">
                
            </div>
        </div>
    </div>
</section>