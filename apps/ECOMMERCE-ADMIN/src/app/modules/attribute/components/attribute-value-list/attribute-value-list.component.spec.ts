import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributeValueListComponent } from './attribute-value-list.component';

describe('AttributeValueListComponent', () => {
  let component: AttributeValueListComponent;
  let fixture: ComponentFixture<AttributeValueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeValueListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
