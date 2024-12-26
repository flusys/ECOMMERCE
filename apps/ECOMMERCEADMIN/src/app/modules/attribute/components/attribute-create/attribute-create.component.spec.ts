import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeCreateComponent } from './attribute-create.component';

describe('AttributeCreateComponent', () => {
  let component: AttributeCreateComponent;
  let fixture: ComponentFixture<AttributeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
