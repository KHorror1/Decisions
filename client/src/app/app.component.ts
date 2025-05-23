import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  inputItem = '';
  itemList: string[] = [];
  rollingItems: string[] = [];
  selectedItem = '';
  isRolling = false;
  transformStyle = 'translateX(0px)';
  transitionEnabled = true;

  presetName = '';
  presets: { [key: string]: string[] } = {};
  activePreset = '';

  ngOnInit(): void {
    window.electronAPI.getPresets().then((data) => {
      this.presets = data;

      const keys = Object.keys(data);
      if (keys.length > 0) {
        this.loadPreset(keys[0]);
      }

      this.cdr.detectChanges(); // Ensure preset panel is rendered
    });
  }

  

  addItem(): void {
    if (!this.inputItem.trim()) return;

    const items = this.inputItem
      .split(/[;]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    this.itemList.push(...items);
    this.inputItem = '';
  }

  newPreset(): void {
  this.itemList = [];
  this.selectedItem = '';
  this.presetName = '';
  this.activePreset = '';
  }

  onInputKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault(); // optional, prevents form submission
    this.addItem();
  }
  }

  removeItem(index: number): void {
    this.itemList.splice(index, 1);
  }

  savePreset(): void {
    const name = this.presetName.trim() || 'Untitled';
    this.presets[name] = [...this.itemList];
    this.activePreset = name;
    this.presetName = '';
    //this.itemList = []; // Clear items after saving preset
    window.electronAPI.savePresets(this.presets);
  }

  loadPreset(name: string): void {
    this.itemList = [...this.presets[name]];
    this.activePreset = name;
    this.selectedItem = '';
    this.cdr.detectChanges();
  }

  deletePreset(name: string): void {
    delete this.presets[name];
    if (this.activePreset === name) {
      this.itemList = [];
      this.activePreset = '';
    }
    window.electronAPI.savePresets(this.presets);
  }

  updatePreset(): void {
    if (!this.activePreset) return;
    this.presets[this.activePreset] = [...this.itemList];
    window.electronAPI.savePresets(this.presets);
  }

  getPresetKeys(): string[] {
    return Object.keys(this.presets);
  }

  revealWinner(): void {
  if (this.itemList.length < 1 || this.isRolling) return;
  this.selectedItem = this.itemList[Math.floor(Math.random() * this.itemList.length)];
  this.rollingItems = [];  // Clear out rollingItems
  this.transformStyle = 'translateX(0px)';  // Reset style just in case
}

  startRoll(): void {
    if (this.itemList.length < 1 || this.isRolling) return;

    this.isRolling = true;
    this.selectedItem = '';
    this.rollingItems = [];
    this.transitionEnabled = false;

    const itemWidth = 130;
    const gap = 16;
    const totalWidth = itemWidth + gap;
    const visibleItems = 50;
    const sidePadding = 10;
    const totalItems = visibleItems + sidePadding * 2;
    const centerIndex = sidePadding + Math.floor(visibleItems / 2);

    const startIndex = Math.floor(Math.random() * this.itemList.length);

    for (let i = 0; i < totalItems; i++) {
      const item = this.itemList[(startIndex + i) % this.itemList.length];
      this.rollingItems.push(item);
    }

    const winningItem = this.itemList[Math.floor(Math.random() * this.itemList.length)];
    this.rollingItems[centerIndex] = winningItem;
    this.transformStyle = 'translateX(0px)';

    requestAnimationFrame(() => {
      this.transitionEnabled = true;

      const container = document.querySelector('.case-container') as HTMLElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const scrollOffset = (centerIndex * totalWidth) - (containerWidth / 2 - itemWidth / 2);
      this.transformStyle = `translateX(-${scrollOffset}px)`;

      setTimeout(() => {
        const caseStrip = container.querySelector('.case-strip') as HTMLElement;
        const items = Array.from(caseStrip.querySelectorAll('span'));
        const centerX = container.getBoundingClientRect().left + container.offsetWidth / 2;

        const centerElement = items.find((el) => {
          const rect = el.getBoundingClientRect();
          return rect.left <= centerX && rect.right >= centerX;
        });

        this.selectedItem = centerElement ? centerElement.textContent || '' : winningItem;
        this.isRolling = false;
      }, 3700);
    });
  }
}
