const SettingsItem = {
    props: ["name"],
    template: `
    <div class="collection-item">
        <div class="row">
            <div class="col s4 setting-name">
                <b>{{ name }}</b>
            </div>
            <div class="col s8 setting-value">
                <slot></slot>
            </div>
        </div>
    </div>
    `
}

module.exports = SettingsItem;