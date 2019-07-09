const Modal = {
    props: ["modalId", "name", "subheader"],
    template: `
        <div id="{{ modalId }}" class="modal">
            <div class="modal-header indigo darken-4 white-text" style="padding: 17px;">
                <h4 style="margin: 0;">{{ name }}</h4>
                <p style="margin: 0;">{{ subheader }}</p>
            </div>
            <div class="modal-content">
                <slot></slot>
            </div>
            <div class="modal-footer">
                <button class="btn-flat white-text waves-effect green waves-light">Create</button>
            </div>
        </div>
    `
}

module.exports = Modal;