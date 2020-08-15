import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card';
import {ClipboardModule} from '@angular/cdk/clipboard';


@NgModule({
    imports:[
        MatExpansionModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatToolbarModule,
        MatInputModule,
        MatChipsModule,
        MatBadgeModule,
        MatCardModule,
        ClipboardModule
    ],
    exports:[
        MatExpansionModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatToolbarModule,
        MatInputModule,
        MatChipsModule,
        MatBadgeModule,
        MatCardModule,
        ClipboardModule
    ],
    declarations: [],
})

export class MaterialModule{}