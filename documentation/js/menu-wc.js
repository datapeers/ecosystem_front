'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ecosystem-front documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdminModule-8ec1ed1655672be137fc424a043de1912d5c791fec47406d9e1737b3d752c0ed78caa97bddb6e697beceef57909165a0f0dd1d5ae6a2f8273a8e3341395c91ed"' : 'data-bs-target="#xs-components-links-module-AdminModule-8ec1ed1655672be137fc424a043de1912d5c791fec47406d9e1737b3d752c0ed78caa97bddb6e697beceef57909165a0f0dd1d5ae6a2f8273a8e3341395c91ed"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-8ec1ed1655672be137fc424a043de1912d5c791fec47406d9e1737b3d752c0ed78caa97bddb6e697beceef57909165a0f0dd1d5ae6a2f8273a8e3341395c91ed"' :
                                            'id="xs-components-links-module-AdminModule-8ec1ed1655672be137fc424a043de1912d5c791fec47406d9e1737b3d752c0ed78caa97bddb6e697beceef57909165a0f0dd1d5ae6a2f8273a8e3341395c91ed"' }>
                                            <li class="link">
                                                <a href="components/AdminComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IntegrationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IntegrationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InvitationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvitationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PermissionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RolesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RolesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermsOfUseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermsOfUseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsersAssignComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersAssignComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsersPanelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ZoomComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ZoomComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRoutingModule.html" data-type="entity-link" >AdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' : 'data-bs-target="#xs-components-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' :
                                            'id="xs-components-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignInComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignInComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignUpComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignUpComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' : 'data-bs-target="#xs-injectables-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' :
                                        'id="xs-injectables-links-module-AppModule-39387560131caf07a0aa2dfa41e7a471ea03d565c4365d2c2b4e042134ffb627534a07b6c14afd1c9be66a5a4c05df1106869d5dccae6894b800ee089b6b883d"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ToastService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToastService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppSharedModule.html" data-type="entity-link" >AppSharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' : 'data-bs-target="#xs-components-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' :
                                            'id="xs-components-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' }>
                                            <li class="link">
                                                <a href="components/RateByUserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RateByUserComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' : 'data-bs-target="#xs-pipes-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' :
                                            'id="xs-pipes-links-module-AppSharedModule-9628b0cef5d5e17413ce0e9d9ac3bdd5a9c37642ce32caa81d53c806281fe2ad144e01e6da0672038b50da7ccbc9e78b4a4f438c3f271a1e1e75ae84c46524c1"' }>
                                            <li class="link">
                                                <a href="pipes/ClassNamePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClassNamePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SafePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SafePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AvatarUploaderModule.html" data-type="entity-link" >AvatarUploaderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AvatarUploaderModule-9647d01b575a4da206133d26065d49eb7669966b87a476bd9a4c061e7279f07e47bea80f4d4488fa0a0bc3cc51d3c276c3a695dbbd5242277c9b78d634a269fc"' : 'data-bs-target="#xs-components-links-module-AvatarUploaderModule-9647d01b575a4da206133d26065d49eb7669966b87a476bd9a4c061e7279f07e47bea80f4d4488fa0a0bc3cc51d3c276c3a695dbbd5242277c9b78d634a269fc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AvatarUploaderModule-9647d01b575a4da206133d26065d49eb7669966b87a476bd9a4c061e7279f07e47bea80f4d4488fa0a0bc3cc51d3c276c3a695dbbd5242277c9b78d634a269fc"' :
                                            'id="xs-components-links-module-AvatarUploaderModule-9647d01b575a4da206133d26065d49eb7669966b87a476bd9a4c061e7279f07e47bea80f4d4488fa0a0bc3cc51d3c276c3a695dbbd5242277c9b78d634a269fc"' }>
                                            <li class="link">
                                                <a href="components/AvatarUploaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AvatarUploaderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DynamicTableModule.html" data-type="entity-link" >DynamicTableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' : 'data-bs-target="#xs-components-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' :
                                            'id="xs-components-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' }>
                                            <li class="link">
                                                <a href="components/BusinessSelectTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BusinessSelectTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigSelectorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigSelectorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DynamicTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DynamicTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntrepreneurSelectTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EntrepreneurSelectTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartupSelectTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartupSelectTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableConfigComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableConfigComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableSelectDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableSelectDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' : 'data-bs-target="#xs-pipes-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' :
                                            'id="xs-pipes-links-module-DynamicTableModule-d32d77d9d8042441b8e3b4ad25163648146f44af34f2b74ff0b56df9c00d425ac9dbade1fd207177a8c816e8ab68a14b2290d1694bc73c6b9786815891db245f"' }>
                                            <li class="link">
                                                <a href="pipes/CellFormatPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CellFormatPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FormModule.html" data-type="entity-link" >FormModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-FormModule-96b151390bfb656de191d94986e085b737b24014e328ea807e77ee9787c45b89ad6d93784f6fadbcd9f6c723ab1f5dfbe0df887bc1fb9387dc8409151e7a875b"' : 'data-bs-target="#xs-components-links-module-FormModule-96b151390bfb656de191d94986e085b737b24014e328ea807e77ee9787c45b89ad6d93784f6fadbcd9f6c723ab1f5dfbe0df887bc1fb9387dc8409151e7a875b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FormModule-96b151390bfb656de191d94986e085b737b24014e328ea807e77ee9787c45b89ad6d93784f6fadbcd9f6c723ab1f5dfbe0df887bc1fb9387dc8409151e7a875b"' :
                                            'id="xs-components-links-module-FormModule-96b151390bfb656de191d94986e085b737b24014e328ea807e77ee9787c45b89ad6d93784f6fadbcd9f6c723ab1f5dfbe0df887bc1fb9387dc8409151e7a875b"' }>
                                            <li class="link">
                                                <a href="components/FormRendererComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormRendererComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GraphQLModule.html" data-type="entity-link" >GraphQLModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link" >HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HomeModule-0f92f94a7e807cf20c0b754f78e34d4403125f7e7fe7782b573a36c5afa6447d57f4ce95d707609f3280e27679fa9dd5e42682d3aebde50e8d1dd4db25b01a8c"' : 'data-bs-target="#xs-components-links-module-HomeModule-0f92f94a7e807cf20c0b754f78e34d4403125f7e7fe7782b573a36c5afa6447d57f4ce95d707609f3280e27679fa9dd5e42682d3aebde50e8d1dd4db25b01a8c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeModule-0f92f94a7e807cf20c0b754f78e34d4403125f7e7fe7782b573a36c5afa6447d57f4ce95d707609f3280e27679fa9dd5e42682d3aebde50e8d1dd4db25b01a8c"' :
                                            'id="xs-components-links-module-HomeModule-0f92f94a7e807cf20c0b754f78e34d4403125f7e7fe7782b573a36c5afa6447d57f4ce95d707609f3280e27679fa9dd5e42682d3aebde50e8d1dd4db25b01a8c"' }>
                                            <li class="link">
                                                <a href="components/ActaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AnnouncementEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AnnouncementLoadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementLoadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AnnouncementsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AnnouncementsCreatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnnouncementsCreatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApplicantSelectDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApplicantSelectDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApplicantStateEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApplicantStateEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApplicantsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApplicantsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AssignHoursComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AssignHoursComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AssignStartupsHoursComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AssignStartupsHoursComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BusinessesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BusinessesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalendarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalendarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CommunitiesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommunitiesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfigurationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContentsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DatefilterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatefilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntrepreneursComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EntrepreneursComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvaluationTablesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvaluationTablesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvaluationUserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EvaluationUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventCreatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventCreatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExpertsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExpertsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FormsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HelpdeskComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HelpdeskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InitComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InitComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InvestorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InvestorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListParticipationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListParticipationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoadingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseContentCreatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseContentCreatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseContentResourceCreatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseContentResourceCreatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseContentViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseContentViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseEvaluationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseEvaluationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseEventsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseEventsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseExpertsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseExpertsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseHomeworkTableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseHomeworkTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseHomeworksComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseHomeworksComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseHoursConfigComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseHoursConfigComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseLoadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseLoadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhaseStartupsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhaseStartupsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhasesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhasesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhasesConfigComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhasesConfigComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhasesCreatorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhasesCreatorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PhasesEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PhasesEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QrViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >QrViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RatingEventComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RatingEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResourceCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResourceCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RouteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RouteStageDescriptionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RouteStageDescriptionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SiteManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SiteManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SiteServicesManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SiteServicesManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StagesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartupDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartupDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartupInvitationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartupInvitationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartupProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartupProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StartupsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StartupsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermsDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermsDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolkitComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolkitComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ValidateParticipationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ValidateParticipationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeRoutingModule.html" data-type="entity-link" >HomeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IconsModule.html" data-type="entity-link" >IconsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NavigationModule.html" data-type="entity-link" >NavigationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-NavigationModule-7b43193fc723937febd9eac8391cafd28c8bbba0a3b5aca8e211916c0a7a0e565c96853f402f3f53fb25a1ad572e40cd4f18d54f3d4a6043727a6b7bffafff6e"' : 'data-bs-target="#xs-components-links-module-NavigationModule-7b43193fc723937febd9eac8391cafd28c8bbba0a3b5aca8e211916c0a7a0e565c96853f402f3f53fb25a1ad572e40cd4f18d54f3d4a6043727a6b7bffafff6e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NavigationModule-7b43193fc723937febd9eac8391cafd28c8bbba0a3b5aca8e211916c0a7a0e565c96853f402f3f53fb25a1ad572e40cd4f18d54f3d4a6043727a6b7bffafff6e"' :
                                            'id="xs-components-links-module-NavigationModule-7b43193fc723937febd9eac8391cafd28c8bbba0a3b5aca8e211916c0a7a0e565c96853f402f3f53fb25a1ad572e40cd4f18d54f3d4a6043727a6b7bffafff6e"' }>
                                            <li class="link">
                                                <a href="components/DividerTextComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DividerTextComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SideNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SideNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SideNavRouteIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SideNavRouteIconComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SubMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SublevelMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SublevelMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TopNavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TopNavComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrimengModule.html" data-type="entity-link" >PrimengModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StorageModule.html" data-type="entity-link" >StorageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-StorageModule-885f8606bff79f0754fe184eedafd54022a75d510a18b4513dab8381eba46af784a3cbd7cdb51ecaebf8085e70d1675fec62fd36be1abc3ee7ec758fa4c70568"' : 'data-bs-target="#xs-pipes-links-module-StorageModule-885f8606bff79f0754fe184eedafd54022a75d510a18b4513dab8381eba46af784a3cbd7cdb51ecaebf8085e70d1675fec62fd36be1abc3ee7ec758fa4c70568"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-StorageModule-885f8606bff79f0754fe184eedafd54022a75d510a18b4513dab8381eba46af784a3cbd7cdb51ecaebf8085e70d1675fec62fd36be1abc3ee7ec758fa4c70568"' :
                                            'id="xs-pipes-links-module-StorageModule-885f8606bff79f0754fe184eedafd54022a75d510a18b4513dab8381eba46af784a3cbd7cdb51ecaebf8085e70d1675fec62fd36be1abc3ee7ec758fa4c70568"' }>
                                            <li class="link">
                                                <a href="pipes/GetImagePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GetImagePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/DatefilterComponent.html" data-type="entity-link" >DatefilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DividerTextComponent.html" data-type="entity-link" >DividerTextComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EvaluationUserComponent.html" data-type="entity-link" >EvaluationUserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingComponent.html" data-type="entity-link" >LoadingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/QrViewComponent.html" data-type="entity-link" >QrViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TermsDialogComponent.html" data-type="entity-link" >TermsDialogComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Acta.html" data-type="entity-link" >Acta</a>
                            </li>
                            <li class="link">
                                <a href="classes/ActivateBtnReturn.html" data-type="entity-link" >ActivateBtnReturn</a>
                            </li>
                            <li class="link">
                                <a href="classes/ActivitiesConfig.html" data-type="entity-link" >ActivitiesConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Announcement.html" data-type="entity-link" >Announcement</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppForm.html" data-type="entity-link" >AppForm</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppJwt.html" data-type="entity-link" >AppJwt</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplicantState.html" data-type="entity-link" >ApplicantState</a>
                            </li>
                            <li class="link">
                                <a href="classes/Attachment.html" data-type="entity-link" >Attachment</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClearAnnouncementStoreAction.html" data-type="entity-link" >ClearAnnouncementStoreAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClearAuthStoreAction.html" data-type="entity-link" >ClearAuthStoreAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClearPhaseStoreAction.html" data-type="entity-link" >ClearPhaseStoreAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigEvaluation.html" data-type="entity-link" >ConfigEvaluation</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigurationApp.html" data-type="entity-link" >ConfigurationApp</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContactService.html" data-type="entity-link" >ContactService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Content.html" data-type="entity-link" >Content</a>
                            </li>
                            <li class="link">
                                <a href="classes/CustomValidators.html" data-type="entity-link" >CustomValidators</a>
                            </li>
                            <li class="link">
                                <a href="classes/DocumentProvider.html" data-type="entity-link" >DocumentProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/DynamicTable.html" data-type="entity-link" >DynamicTable</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntrepreneurItemDisplay.html" data-type="entity-link" >EntrepreneurItemDisplay</a>
                            </li>
                            <li class="link">
                                <a href="classes/Evaluation.html" data-type="entity-link" >Evaluation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Event.html" data-type="entity-link" >Event</a>
                            </li>
                            <li class="link">
                                <a href="classes/FailUpdateAnnouncementAction.html" data-type="entity-link" >FailUpdateAnnouncementAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/FailUpdatePhaseAction.html" data-type="entity-link" >FailUpdatePhaseAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/FailUpdateUserAction.html" data-type="entity-link" >FailUpdateUserAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/FieldFilter.html" data-type="entity-link" >FieldFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/FieldSort.html" data-type="entity-link" >FieldSort</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterOperation.html" data-type="entity-link" >FilterOperation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Integration.html" data-type="entity-link" >Integration</a>
                            </li>
                            <li class="link">
                                <a href="classes/Invitation.html" data-type="entity-link" >Invitation</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoadingMenuAction.html" data-type="entity-link" >LoadingMenuAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoBtnReturn.html" data-type="entity-link" >NoBtnReturn</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParticipationEvent.html" data-type="entity-link" >ParticipationEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/Phase.html" data-type="entity-link" >Phase</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublishAnnouncementAction.html" data-type="entity-link" >PublishAnnouncementAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Resource.html" data-type="entity-link" >Resource</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResourceReply.html" data-type="entity-link" >ResourceReply</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreBreadcrumbAction.html" data-type="entity-link" >RestoreBreadcrumbAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/RestoreMenuAction.html" data-type="entity-link" >RestoreMenuAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rol.html" data-type="entity-link" >Rol</a>
                            </li>
                            <li class="link">
                                <a href="classes/RowConfigColumn.html" data-type="entity-link" >RowConfigColumn</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchCurrentBatch.html" data-type="entity-link" >SearchCurrentBatch</a>
                            </li>
                            <li class="link">
                                <a href="classes/searchResult.html" data-type="entity-link" >searchResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceSite.html" data-type="entity-link" >ServiceSite</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetAnnouncementAction.html" data-type="entity-link" >SetAnnouncementAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetBreadcrumbAction.html" data-type="entity-link" >SetBreadcrumbAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetCurrentBatch.html" data-type="entity-link" >SetCurrentBatch</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetLastContent.html" data-type="entity-link" >SetLastContent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetLastContentRequest.html" data-type="entity-link" >SetLastContentRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetMenuAction.html" data-type="entity-link" >SetMenuAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetOtherMenuAction.html" data-type="entity-link" >SetOtherMenuAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetPhaseAction.html" data-type="entity-link" >SetPhaseAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetProfileDocAction.html" data-type="entity-link" >SetProfileDocAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetSubMenuAction.html" data-type="entity-link" >SetSubMenuAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/SetUserAction.html" data-type="entity-link" >SetUserAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/Site.html" data-type="entity-link" >Site</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stage.html" data-type="entity-link" >Stage</a>
                            </li>
                            <li class="link">
                                <a href="classes/TableConfig.html" data-type="entity-link" >TableConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/TermsOfUse.html" data-type="entity-link" >TermsOfUse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Ticket.html" data-type="entity-link" >Ticket</a>
                            </li>
                            <li class="link">
                                <a href="classes/TicketCategory.html" data-type="entity-link" >TicketCategory</a>
                            </li>
                            <li class="link">
                                <a href="classes/TicketChild.html" data-type="entity-link" >TicketChild</a>
                            </li>
                            <li class="link">
                                <a href="classes/ToggleMenuAction.html" data-type="entity-link" >ToggleMenuAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/TypeEvent.html" data-type="entity-link" >TypeEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnpublishAnnouncementAction.html" data-type="entity-link" >UnpublishAnnouncementAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAnnouncementAction.html" data-type="entity-link" >UpdateAnnouncementAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAnnouncementImageAction.html" data-type="entity-link" >UpdateAnnouncementImageAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePhaseAction.html" data-type="entity-link" >UpdatePhaseAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePhaseImageAction.html" data-type="entity-link" >UpdatePhaseImageAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResultPayload.html" data-type="entity-link" >UpdateResultPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserAction.html" data-type="entity-link" >UpdateUserAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserImageAction.html" data-type="entity-link" >UpdateUserImageAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAssign.html" data-type="entity-link" >UserAssign</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ActaService.html" data-type="entity-link" >ActaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AnnouncementEffects.html" data-type="entity-link" >AnnouncementEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AnnouncementsService.html" data-type="entity-link" >AnnouncementsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ApplicantsService.html" data-type="entity-link" >ApplicantsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthCodeService.html" data-type="entity-link" >AuthCodeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthEffects.html" data-type="entity-link" >AuthEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BusinessesService.html" data-type="entity-link" >BusinessesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CalendarService.html" data-type="entity-link" >CalendarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommunitiesService.html" data-type="entity-link" >CommunitiesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationService.html" data-type="entity-link" >ConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContentsService.html" data-type="entity-link" >ContentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DynamicTableService.html" data-type="entity-link" >DynamicTableService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntrepreneursService.html" data-type="entity-link" >EntrepreneursService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExcelService.html" data-type="entity-link" >ExcelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExpertsService.html" data-type="entity-link" >ExpertsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormService.html" data-type="entity-link" >FormService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GraphqlService.html" data-type="entity-link" >GraphqlService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HelpdeskService.html" data-type="entity-link" >HelpdeskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomeEffects.html" data-type="entity-link" >HomeEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomeService.html" data-type="entity-link" >HomeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IntegrationsService.html" data-type="entity-link" >IntegrationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InvestorsService.html" data-type="entity-link" >InvestorsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InvitationService.html" data-type="entity-link" >InvitationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseContentService.html" data-type="entity-link" >PhaseContentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseEffects.html" data-type="entity-link" >PhaseEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseEvaluationsService.html" data-type="entity-link" >PhaseEvaluationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseEventsService.html" data-type="entity-link" >PhaseEventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseExpertsService.html" data-type="entity-link" >PhaseExpertsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseHomeworksService.html" data-type="entity-link" >PhaseHomeworksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseHourConfigService.html" data-type="entity-link" >PhaseHourConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhasesService.html" data-type="entity-link" >PhasesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PhaseStartupsService.html" data-type="entity-link" >PhaseStartupsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RolesService.html" data-type="entity-link" >RolesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SiteManagementService.html" data-type="entity-link" >SiteManagementService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StartupsService.html" data-type="entity-link" >StartupsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StorageService.html" data-type="entity-link" >StorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TermsOfUseService.html" data-type="entity-link" >TermsOfUseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToastService.html" data-type="entity-link" >ToastService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToolkitService.html" data-type="entity-link" >ToolkitService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppJwtPayload.html" data-type="entity-link" >AppJwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Applicant.html" data-type="entity-link" >Applicant</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApplicantState.html" data-type="entity-link" >ApplicantState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppState.html" data-type="entity-link" >AppState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Attachment.html" data-type="entity-link" >Attachment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthCode.html" data-type="entity-link" >AuthCode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Business.html" data-type="entity-link" >Business</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnGroup.html" data-type="entity-link" >ColumnGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnHour.html" data-type="entity-link" >ColumnHour</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateAnnouncementInput.html" data-type="entity-link" >CreateAnnouncementInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateEvent.html" data-type="entity-link" >CreateEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateSubscriptionArgs.html" data-type="entity-link" >CreateSubscriptionArgs</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/datedDataStorage.html" data-type="entity-link" >datedDataStorage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/datedFlagMap.html" data-type="entity-link" >datedFlagMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Document.html" data-type="entity-link" >Document</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DownloadRequest.html" data-type="entity-link" >DownloadRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DownloadResult.html" data-type="entity-link" >DownloadResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Entrepreneur.html" data-type="entity-link" >Entrepreneur</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Expert.html" data-type="entity-link" >Expert</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Firebase.html" data-type="entity-link" >Firebase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FormDocument.html" data-type="entity-link" >FormDocument</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FormFile.html" data-type="entity-link" >FormFile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActa.html" data-type="entity-link" >IActa</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActivitiesConfig.html" data-type="entity-link" >IActivitiesConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActivityConfig.html" data-type="entity-link" >IActivityConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActivityConfigInput.html" data-type="entity-link" >IActivityConfigInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAnnouncement.html" data-type="entity-link" >IAnnouncement</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAnnouncementState.html" data-type="entity-link" >IAnnouncementState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAssign.html" data-type="entity-link" >IAssign</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAttachment.html" data-type="entity-link" >IAttachment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthState.html" data-type="entity-link" >IAuthState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBenefactor.html" data-type="entity-link" >IBenefactor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICalendarItem.html" data-type="entity-link" >ICalendarItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IColumn.html" data-type="entity-link" >IColumn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfigEvaluation.html" data-type="entity-link" >IConfigEvaluation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfigExpert.html" data-type="entity-link" >IConfigExpert</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfigStartup.html" data-type="entity-link" >IConfigStartup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfigTeamCoach.html" data-type="entity-link" >IConfigTeamCoach</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfigurationApp.html" data-type="entity-link" >IConfigurationApp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IContactService.html" data-type="entity-link" >IContactService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IContent.html" data-type="entity-link" >IContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Identities.html" data-type="entity-link" >Identities</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDropItem.html" data-type="entity-link" >IDropItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEntityEvent.html" data-type="entity-link" >IEntityEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEvaluation.html" data-type="entity-link" >IEvaluation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEvent.html" data-type="entity-link" >IEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFileUpload.html" data-type="entity-link" >IFileUpload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFileUploadExtended.html" data-type="entity-link" >IFileUploadExtended</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IForm.html" data-type="entity-link" >IForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFormSubscription.html" data-type="entity-link" >IFormSubscription</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFormTag.html" data-type="entity-link" >IFormTag</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHomeState.html" data-type="entity-link" >IHomeState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIntegration.html" data-type="entity-link" >IIntegration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInterestContent.html" data-type="entity-link" >IInterestContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInvitation.html" data-type="entity-link" >IInvitation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IItemStartup.html" data-type="entity-link" >IItemStartup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMenu.html" data-type="entity-link" >IMenu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMenuHeader.html" data-type="entity-link" >IMenuHeader</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMenuOption.html" data-type="entity-link" >IMenuOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INotification.html" data-type="entity-link" >INotification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Investor.html" data-type="entity-link" >Investor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IParticipationEvent.html" data-type="entity-link" >IParticipationEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPhase.html" data-type="entity-link" >IPhase</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPhaseState.html" data-type="entity-link" >IPhaseState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRelationsUser.html" data-type="entity-link" >IRelationsUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResource.html" data-type="entity-link" >IResource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IResourceReply.html" data-type="entity-link" >IResourceReply</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRol.html" data-type="entity-link" >IRol</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISearchResult.html" data-type="entity-link" >ISearchResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IServiceSite.html" data-type="entity-link" >IServiceSite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISite.html" data-type="entity-link" >ISite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IStage.html" data-type="entity-link" >IStage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITableConfig.html" data-type="entity-link" >ITableConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/item_permission.html" data-type="entity-link" >item_permission</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITermsOfUse.html" data-type="entity-link" >ITermsOfUse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITicket.html" data-type="entity-link" >ITicket</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITicketCategory.html" data-type="entity-link" >ITicketCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITicketChild.html" data-type="entity-link" >ITicketChild</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IToastMessage.html" data-type="entity-link" >IToastMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITypeEvent.html" data-type="entity-link" >ITypeEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUser.html" data-type="entity-link" >IUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserLog.html" data-type="entity-link" >IUserLog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IVertical.html" data-type="entity-link" >IVertical</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LabelValueConfig.html" data-type="entity-link" >LabelValueConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/lastContent.html" data-type="entity-link" >lastContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListedObject.html" data-type="entity-link" >ListedObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageRequest.html" data-type="entity-link" >PageRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginatedResult.html" data-type="entity-link" >PaginatedResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProtectedMenuItem.html" data-type="entity-link" >ProtectedMenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Startup.html" data-type="entity-link" >Startup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableAction.html" data-type="entity-link" >TableAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableActionEvent.html" data-type="entity-link" >TableActionEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableJoin.html" data-type="entity-link" >TableJoin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableLazyDownloadEvent.html" data-type="entity-link" >TableLazyDownloadEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableLazyLoadEvent.html" data-type="entity-link" >TableLazyLoadEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableOptions.html" data-type="entity-link" >TableOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateAnnouncementInput.html" data-type="entity-link" >UpdateAnnouncementInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserConfig.html" data-type="entity-link" >UserConfig</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});