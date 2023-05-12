import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphQLModule } from '@graphqlApollo/graphql.module';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormViewComponent } from './form-view/form-view.component';



@NgModule({
  declarations: [
    FormRendererComponent,
    FormViewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    PrimengModule,
  ]
})
export class FormModule { }
