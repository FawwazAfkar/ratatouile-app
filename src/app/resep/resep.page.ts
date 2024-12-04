import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resep',
  templateUrl: './resep.page.html',
  styleUrls: ['./resep.page.scss'],
})
export class ResepPage implements OnInit {
  dataResep: any;
  nama: any;

  constructor(private api: ApiService, private modal: ModalController, private authService: AuthenticationService, private router: Router) {this.nama = this.authService.nama}


  modalTambah: any;
  id: any;
  nama_resep: any;
  deskripsi_resep: any;

  resetModal() {
    this.id = null;
    this.nama_resep = '';
    this.deskripsi_resep = '';
  }

  openModalTambah(isOpen: boolean) {
    this.modalTambah = isOpen;
    this.resetModal();
    this.modalTambah = true;
    this.modalEdit = false;
  }
  
  cancel() {
    this.modal.dismiss();
    this.modalTambah = false;
    this.modalEdit = false;
    this.resetModal();
  }

  tambahResep() {
    if (this.nama_resep != '' && this.deskripsi_resep != '') {
      let data = {
        nama_resep: this.nama_resep,
        deskripsi_resep: this.deskripsi_resep,
      }
      this.api.tambah(data, 'tambah.php')
        .subscribe({
          next: (hasil: any) => {
            this.resetModal();
            console.log('berhasil tambah resep');
            this.getResep();
            this.modalTambah = false;
            this.modal.dismiss();
          },
          error: (err: any) => {
            console.log('gagal tambah resep');
          }
        })
    } else {
      console.log('gagal tambah resep karena masih ada data yg kosong');
    }
  }

  hapusResep(id: any) {
    this.api.hapus(id,
      'hapus.php?id=').subscribe({
        next: (res: any) => {
          console.log('sukses', res);
          this.getResep();
          console.log('berhasil hapus data');
        },
        error: (error: any) => {
          console.log('gagal');
        }
      })
  }
 
  ambilResep(id: any) {
    this.api.lihat(id,
      'lihat.php?id=').subscribe({
        next: (hasil: any) => {
          console.log('sukses', hasil);
          let resep = hasil;
          this.id = resep.id;
          this.nama_resep = resep.nama;
          this.deskripsi_resep = resep.jurusan;
        },
        error: (error: any) => {
          console.log('gagal ambil data');
        }
      })
  }
  modalEdit: any;

  openModalEdit(isOpen: boolean, idget: any) {
    this.modalEdit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilResep(this.id);
    this.modalTambah = false;
    this.modalEdit = true;
  }
  editResep() {
    let data = {
      id: this.id,
      nama_resep: this.nama_resep,
      deskripsi_resep: this.deskripsi_resep
    }
    this.api.edit(data, 'edit.php')
      .subscribe({
        next: (hasil: any) => {
          console.log(hasil);
          this.resetModal();
          this.getResep();
          console.log('berhasil edit Resep');
          this.modalEdit = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal edit Resep');
        }
      })
  }
  
  ngOnInit() {
    this.getResep();
  }

  getResep() {
    this.api.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataResep = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}