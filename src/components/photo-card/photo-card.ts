import {Component, Input} from "@angular/core";
import {ModalController, PopoverController, App} from "ionic-angular";
import {GalleryProvider} from "../../providers/gallery.provider";
import {ProfilePage} from "../../pages/profile/profile";
import {PhotoCommentModalComponent} from "../photo-comment-modal/photo-comment-modal";
import {PhotoListPopoverComponent} from "../photo-list-popover/photo-list-popover";
import {ChatSharePhotoPage} from "../../pages/chat-share-photo/chat-share-photo";
import {AlbumPhotoGridComponent} from "../album-photo-grid/album-photo-grid";

declare const Parse: any;

@Component({
    selector   : 'photo-card',
    templateUrl: 'photo-card.html'
})
export class PhotoCardComponent {

    @Input() item: any;

    username: any;
    loadingLike: boolean = false;

    constructor(private provider: GalleryProvider,
                private app: App,
                private modalCtrl: ModalController,
                private popoverCtrl: PopoverController,
    ) {
        this.username = Parse.User.current().get('username');
    }

    openPopover(ev):void {
        this.popoverCtrl.create(PhotoListPopoverComponent, {item: this.item}).present({ev: ev});
    }

    sharePhoto(item):void {
        this.modalCtrl.create(ChatSharePhotoPage, {image: item.obj}).present();
    }

    openComments(item):void {
        this.modalCtrl.create(PhotoCommentModalComponent, {galleryId: item.id}).present();
    }

    openProfile(username: string):void {
        this.app.getRootNav().push(ProfilePage, {username: username})
    }

    openAlbum(item): void {
        this.app.getRootNav().push(AlbumPhotoGridComponent, {id: item.id});
    }

    onLike(item):void {
        item.loadingLike = true;
        this.provider.likeGallery(item.id).then(data => {
            if (item.isLiked) {
                item.isLiked = false;
                item.likesTotal--;
            } else {
                item.isLiked = true;
                item.likesTotal++;
            }
            item.loadingLike = false;
        });
    }

    onBookmark(item):void {
        item.loadingBookmark = true;
        this.provider.bookmarkGallery(item.id).then(data=>{
            item.isBookmark = !item.isBookmark;
            item.loadingBookmark = false;
        });
    }

}
