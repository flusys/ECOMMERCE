import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComtactUsComponent } from './contact-us.component';

describe('ComtactUsComponent', () => {
  let component: ComtactUsComponent;
  let fixture: ComponentFixture<ComtactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComtactUsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComtactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
